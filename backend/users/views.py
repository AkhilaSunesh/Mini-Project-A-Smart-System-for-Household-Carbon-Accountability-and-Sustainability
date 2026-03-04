from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from .serializers import RegisterSerializer, UserProfileSerializer
from .models import UserProfile


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    """Get or update the current authenticated user's profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        """Allows updating the current user's email and phone number."""
        user = request.user
        try:
            email = request.data.get('email')
            phone_number = request.data.get('phone_number')

            if email:
                # Update User model directly to avoid post_save signal loops if any
                User.objects.filter(pk=user.pk).update(email=email)
                # Refresh from DB
                user.refresh_from_db()

            profile, created = UserProfile.objects.get_or_create(user=user)
            
            if phone_number is not None:
                profile.phone_number = phone_number
                profile.save()

            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordView(APIView):
    """Allow user to change their password."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            old_password = request.data.get("old_password")
            new_password = request.data.get("new_password")

            if not old_password or not new_password:
                return Response({"error": "Both old and new passwords are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Manual check
            if not check_password(old_password, user.password):
                return Response({"error": "Incorrect current password."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully."})
        except Exception as e:
            # Log the error detailedly and return to user
            import traceback
            error_msg = f"Backend Error: {str(e)} - {traceback.format_exc()}"
            print(error_msg)
            return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteAccountView(APIView):
    """Allow user to delete their account permanently."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            password = request.data.get("password")

            if not password:
                return Response({"error": "Password is required for confirmation."}, status=status.HTTP_400_BAD_REQUEST)

            if not check_password(password, user.password):
                return Response({"error": "Incorrect password. Cannot delete account."}, status=status.HTTP_400_BAD_REQUEST)

            # Permanent deletion. Cascade should ideally handle everything.
            user.delete()
            return Response({"message": "Account deleted successfully."})
        except Exception as e:
            import traceback
            error_msg = f"Backend Error during Deletion: {str(e)} - {traceback.format_exc()}"
            print(error_msg)
            return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
