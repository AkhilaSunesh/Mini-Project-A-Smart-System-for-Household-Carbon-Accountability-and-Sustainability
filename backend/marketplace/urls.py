from django.urls import path
from .views import ProjectListView, CreateRazorpayOrderView, VerifyRazorpayPaymentView, UserPurchaseHistoryView

urlpatterns = [
    path('projects/', ProjectListView.as_view()),
    path('create-order/', CreateRazorpayOrderView.as_view()),
    path('verify-payment/', VerifyRazorpayPaymentView.as_view()),
    path('history/', UserPurchaseHistoryView.as_view()),
]
