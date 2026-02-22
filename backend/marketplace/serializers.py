from rest_framework import serializers
from .models import RewardProject, Purchase


class RewardProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardProject
        fields = '__all__'


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'