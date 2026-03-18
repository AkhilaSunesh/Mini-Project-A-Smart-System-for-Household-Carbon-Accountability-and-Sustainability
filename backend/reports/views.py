from django.utils import timezone
from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from .models import EcoActionSubmission, DailyCarbonReport
from .serializers import EcoActionSubmissionSerializer, DailyCarbonReportSerializer, AdminEcoActionSubmissionSerializer
from .permissions import IsAdminRole


class SubmitEcoActionView(APIView):
    """Submit an eco-action with proof image."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            serializer = EcoActionSubmissionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(
                    {"message": "Eco-action submitted successfully!", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            # If serializer is not valid, return specific field errors
            error_data = {"error": "Invalid form data", "details": serializer.errors}
            return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Let's see what exactly happened on server
            import traceback
            print(f"Server-side error submitting eco action: {str(e)} - {traceback.format_exc()}")
            return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


class CarbonStatsView(APIView):
    """Return aggregated carbon stats for charts."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'daily').lower()
        now = timezone.now().date()
        data = []

        if period == 'daily':
            # Current Week breakdown (Mon to Sun)
            weekday = now.weekday()  # Monday is 0
            monday = now - timezone.timedelta(days=weekday)
            for i in range(7):
                d = monday + timezone.timedelta(days=i)
                stats = DailyCarbonReport.objects.filter(user=request.user, date=d).aggregate(
                    t=models.Sum('transport_co2'),
                    e=models.Sum('energy_co2'),
                    wa=models.Sum('water_co2'),
                    ws=models.Sum('waste_co2'),
                    tot=models.Sum('total_co2')
                )
                data.append({
                    'day': d.strftime('%a'),
                    'transport': round(stats['t'] or 0, 2),
                    'energy': round((stats['e'] or 0) + (stats['wa'] or 0), 2),
                    'waste': round(stats['ws'] or 0, 2),
                    'total': round(stats['tot'] or 0, 2)
                })

        elif period == 'weekly':
            # True Calendar Weeks of the Current Month
            import calendar
            curr_year = now.year
            curr_month = now.month
            # monthcalendar returns a list of weeks, where each week is a list of 7 days (0 if not in month)
            cal = calendar.monthcalendar(curr_year, curr_month)
            
            for i, week in enumerate(cal):
                # Filter out the 0s and get start/end dates
                days = [d for d in week if d > 0]
                if not days:
                    continue
                    
                start_day = days[0]
                end_day = days[-1]
                
                start_date = now.replace(day=start_day)
                end_date = now.replace(day=end_day)
                
                # Format label: Week X (Mar 1 - Mar 7) or Week X (Mar 1)
                month_str = start_date.strftime('%b')
                if start_day == end_day:
                    label = f"Week {i+1} ({month_str} {start_day})"
                else:
                    label = f"Week {i+1} ({month_str} {start_day}-{end_day})"
                
                stats = DailyCarbonReport.objects.filter(
                    user=request.user, 
                    date__range=[start_date, end_date]
                ).aggregate(
                    t=models.Sum('transport_co2'),
                    e=models.Sum('energy_co2'),
                    wa=models.Sum('water_co2'),
                    ws=models.Sum('waste_co2'),
                    tot=models.Sum('total_co2')
                )
                data.append({
                    'day': label,
                    'transport': round(stats['t'] or 0, 2),
                    'energy': round((stats['e'] or 0) + (stats['wa'] or 0), 2),
                    'waste': round(stats['ws'] or 0, 2),
                    'total': round(stats['tot'] or 0, 2)
                })

        elif period == 'monthly':
            # Last 12 months (or full year)
            # The user asked for Jan...Dec, but usually we show trailing 12 months if earlier in year
            # Let's provide months of the current year + trailing if needed, but Jan-Dec is 12 slots.
            # We'll show Jan to Dec of current year as requested.
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            curr_year = now.year
            for i, m_name in enumerate(months):
                stats = DailyCarbonReport.objects.filter(
                    user=request.user,
                    date__year=curr_year,
                    date__month=i+1
                ).aggregate(
                    t=models.Sum('transport_co2'),
                    e=models.Sum('energy_co2'),
                    wa=models.Sum('water_co2'),
                    ws=models.Sum('waste_co2'),
                    tot=models.Sum('total_co2')
                )
                data.append({
                    'day': m_name,
                    'transport': round(stats['t'] or 0, 2),
                    'energy': round((stats['e'] or 0) + (stats['wa'] or 0), 2),
                    'waste': round(stats['ws'] or 0, 2),
                    'total': round(stats['tot'] or 0, 2)
                })

        return Response(data)


class CarbonReportDetailView(APIView):
    """Update or delete a specific carbon report."""
    permission_classes = [IsAuthenticated]

    def get_object(self, user, pk):
        try:
            return DailyCarbonReport.objects.get(user=user, pk=pk)
        except DailyCarbonReport.DoesNotExist:
            return None

    def get(self, request, pk):
        report = self.get_object(request.user, pk)
        if not report:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DailyCarbonReportSerializer(report)
        return Response(serializer.data)

    def put(self, request, pk):
        report = self.get_object(request.user, pk)
        if not report:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DailyCarbonReportSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Report updated successfully!", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            report = self.get_object(request.user, pk)
            if not report:
                return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
            report.delete()
            return Response({"message": "Report deleted successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            print(f"Error during carbon report deletion: {str(e)} - {traceback.format_exc()}")
            return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminEcoActionListView(APIView):
    """List all eco-action submissions for admin review."""
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        submissions = EcoActionSubmission.objects.all().order_by('-submitted_at')
        serializer = AdminEcoActionSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class AdminEcoActionDetailView(APIView):
    """Review an eco-action submission (approve/reject)."""
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_object(self, pk):
        try:
            return EcoActionSubmission.objects.get(pk=pk)
        except EcoActionSubmission.DoesNotExist:
            return None

    def patch(self, request, pk):
        submission = self.get_object(pk)
        if not submission:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
            
        data = request.data
        if data.get('status') in ['verified', 'rejected']:
            if data['status'] == 'verified' and 'points' not in data:
                return Response({"error": "Points must be provided when verifying."}, status=status.HTTP_400_BAD_REQUEST)
                
            serializer = AdminEcoActionSubmissionSerializer(submission, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": f"Submission {data['status']} successfully", "data": serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Invalid status or missing status."}, status=status.HTTP_400_BAD_REQUEST)

