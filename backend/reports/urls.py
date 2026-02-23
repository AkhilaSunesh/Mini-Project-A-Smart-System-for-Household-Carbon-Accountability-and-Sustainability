from django.urls import path
from .views import SubmitEcoActionView, UserSubmissionsView, SubmitCarbonReportView, UserCarbonHistoryView

urlpatterns = [
    path('submit/', SubmitEcoActionView.as_view(), name='submit-eco-action'),
    path('my/', UserSubmissionsView.as_view(), name='my-submissions'),
    path('carbon/submit/', SubmitCarbonReportView.as_view(), name='submit-carbon-report'),
    path('carbon/history/', UserCarbonHistoryView.as_view(), name='carbon-history'),
]
