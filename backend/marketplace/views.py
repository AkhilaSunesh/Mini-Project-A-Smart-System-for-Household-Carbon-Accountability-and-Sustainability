from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from users.models import UserProfile
from .models import RewardProject, Purchase
from .serializers import RewardProjectSerializer


# 🔹 List Active Carbon Credit Listings
class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = RewardProject.objects.filter(is_active=True)
        serializer = RewardProjectSerializer(projects, many=True)
        return Response(serializer.data)


# 🔹 Buy Carbon Credits
class PurchaseProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get("project_id")
        credits_to_buy = request.data.get("credits")

        # 🔹 Validate input
        if not project_id or not credits_to_buy:
            return Response(
                {"error": "project_id and credits are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            credits_to_buy = float(credits_to_buy)
        except ValueError:
            return Response(
                {"error": "Credits must be a number"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            project = RewardProject.objects.get(id=project_id, is_active=True)
        except RewardProject.DoesNotExist:
            return Response(
                {"error": "Listing not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔹 Check credit availability
        if project.credits_available < credits_to_buy:
            return Response(
                {"error": "Not enough credits available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = UserProfile.objects.get(user=request.user)

        total_price = credits_to_buy * project.price_per_credit

        # 🔹 Add credits to user
        profile.carbon_credits += credits_to_buy
        profile.save()

        # 🔹 Reduce listing credits
        project.credits_available -= credits_to_buy

        if project.credits_available == 0:
            project.is_active = False

        project.save()

        # 🔹 Save purchase record
        Purchase.objects.create(
            user=request.user,
            project=project,
            credits_bought=credits_to_buy,
            total_price=total_price
        )

        return Response({
            "message": "Credits purchased successfully",
            "organization": project.organization_name,
            "credits_added": credits_to_buy,
            "price_per_credit": project.price_per_credit,
            "total_price": total_price
        }, status=status.HTTP_200_OK)


# 🔹 User Purchase History
class UserPurchaseHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        purchases = Purchase.objects.filter(user=request.user).order_by('-created_at')
        data = []
        for p in purchases:
            data.append({
                "id": p.id,
                "organization_name": p.project.organization_name,
                "credits_bought": p.credits_bought,
                "total_price": p.total_price,
                "price_per_credit": p.project.price_per_credit,
                "created_at": p.created_at.isoformat(),
            })
        return Response(data)
