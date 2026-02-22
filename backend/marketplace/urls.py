from django.urls import path
from .views import ProjectListView, PurchaseProjectView

urlpatterns = [
    path('projects/', ProjectListView.as_view()),
    path('purchase/', PurchaseProjectView.as_view()),
]