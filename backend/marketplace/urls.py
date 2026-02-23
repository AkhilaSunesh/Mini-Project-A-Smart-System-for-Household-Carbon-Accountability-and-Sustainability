from django.urls import path
from .views import ProjectListView, PurchaseProjectView, UserPurchaseHistoryView

urlpatterns = [
    path('projects/', ProjectListView.as_view()),
    path('purchase/', PurchaseProjectView.as_view()),
    path('history/', UserPurchaseHistoryView.as_view()),
]
