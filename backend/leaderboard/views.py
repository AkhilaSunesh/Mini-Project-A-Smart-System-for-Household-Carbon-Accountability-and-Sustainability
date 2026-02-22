from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import UserProfile
from .serializers import LeaderboardSerializer

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = UserProfile.objects.all().order_by('-carbon_credits')
        serializer = LeaderboardSerializer(profiles, many=True)
        return Response(serializer.data)