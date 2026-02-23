from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from .models import EcoActionSubmission, DailyCarbonReport
from .serializers import EcoActionSubmissionSerializer, DailyCarbonReportSerializer


class SubmitEcoActionView(APIView):
    """Submit an eco-action with proof image."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = EcoActionSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Eco-action submitted successfully!", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSubmissionsView(APIView):
    """List all eco-action submissions by the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        submissions = EcoActionSubmission.objects.filter(user=request.user).order_by('-submitted_at')
        serializer = EcoActionSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class SubmitCarbonReportView(APIView):
    """Submit daily carbon footprint data."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DailyCarbonReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Carbon report submitted successfully!", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCarbonHistoryView(APIView):
    """List all carbon reports for the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = DailyCarbonReport.objects.filter(user=request.user).order_by('-date')
        serializer = DailyCarbonReportSerializer(reports, many=True)
        return Response(serializer.data)
