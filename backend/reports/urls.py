from django.urls import path
from .views import SubmitEcoActionView, UserSubmissionsView, SubmitCarbonReportView, UserCarbonHistoryView, CarbonStatsView, CarbonReportDetailView

urlpatterns = [
    path('submit/', SubmitEcoActionView.as_view(), name='submit-eco-action'),
    path('my/', UserSubmissionsView.as_view(), name='my-submissions'),
    path('carbon/submit/', SubmitCarbonReportView.as_view(), name='submit-carbon-report'),
    path('carbon/history/', UserCarbonHistoryView.as_view(), name='carbon-history'),
    path('carbon/stats/', CarbonStatsView.as_view(), name='carbon-stats'),
    path('carbon/<int:pk>/', CarbonReportDetailView.as_view(), name='carbon-detail'),
]
