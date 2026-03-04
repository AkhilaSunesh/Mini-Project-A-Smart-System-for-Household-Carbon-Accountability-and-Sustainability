from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from users.models import UserProfile
from .models import RewardProject, Purchase
from .serializers import RewardProjectSerializer


import razorpay
from django.conf import settings
from django.db import transaction

# Initialize Razorpay helper
def get_razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise Exception("Razorpay API keys are missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your settings.")
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# 🔹 List Active Carbon Credit Listings
class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = RewardProject.objects.filter(is_active=True)
        serializer = RewardProjectSerializer(projects, many=True)
        return Response(serializer.data)


# 🔹 NEW: Create Razorpay Order
class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get("project_id")
        credits_to_buy = request.data.get("credits")

        if not project_id or not credits_to_buy:
            return Response({"error": "project_id and credits are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            credits_to_buy = float(credits_to_buy)
            project = RewardProject.objects.get(id=project_id, is_active=True)
        except (ValueError, RewardProject.DoesNotExist):
            return Response({"error": "Invalid input or project not found"}, status=status.HTTP_404_NOT_FOUND)

        if project.credits_available < credits_to_buy:
            return Response({"error": "Not enough credits available"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = credits_to_buy * project.price_per_credit
        amount_in_paise = int(total_price * 100) # Razorpay expects amount in paise (1 INR = 100 Paise)

        try:
            client = get_razorpay_client()
            # Create Razorpay Order
            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": "1" # Auto-capture payment
            })

            # Save pending purchase record
            purchase = Purchase.objects.create(
                user=request.user,
                project=project,
                credits_bought=credits_to_buy,
                total_price=total_price,
                razorpay_order_id=razorpay_order['id'],
                payment_status='PENDING'
            )
        except Exception as e:
            return Response({"error": f"Razorpay error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "razorpay_order_id": razorpay_order['id'],
            "razorpay_key_id": settings.RAZORPAY_KEY_ID,
            "amount": total_price,
            "currency": "INR",
            "organization": project.organization_name
        })


# 🔹 NEW: Verify Razorpay Payment
class VerifyRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')

        try:
            client = get_razorpay_client()
            # Verify signature locally to ensure security
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            # Start transaction to ensure atomicity
            with transaction.atomic():
                purchase = Purchase.objects.select_for_update().get(razorpay_order_id=razorpay_order_id)
                
                if purchase.payment_status == 'COMPLETED':
                    return Response({"message": "Payment already processed"}, status=status.HTTP_200_OK)

                # Update purchase record
                purchase.razorpay_payment_id = razorpay_payment_id
                purchase.razorpay_signature = razorpay_signature
                purchase.payment_status = 'COMPLETED'
                purchase.save()

                # Update User Profile (Add credits)
                profile = UserProfile.objects.select_for_update().get(user=purchase.user)
                profile.carbon_credits += purchase.credits_bought
                profile.save()

                # Update Project (Reduce listing credits)
                project = purchase.project
                project.credits_available -= purchase.credits_bought
                if project.credits_available <= 0:
                    project.is_active = False
                project.save()

            return Response({"message": "Payment verified and credits added successfully"}, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)
        except Purchase.DoesNotExist:
            return Response({"error": "Purchase record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 🔹 User Purchase History
class UserPurchaseHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only show completed purchases
        purchases = Purchase.objects.filter(user=request.user, payment_status='COMPLETED').order_by('-created_at')
        data = []
        for p in purchases:
            data.append({
                "id": p.id,
                "organization_name": p.project.organization_name,
                "credits_bought": p.credits_bought,
                "total_price": p.total_price,
                "price_per_credit": p.project.price_per_credit,
                "created_at": p.created_at.isoformat(),
                "status": p.payment_status
            })
        return Response(data)
