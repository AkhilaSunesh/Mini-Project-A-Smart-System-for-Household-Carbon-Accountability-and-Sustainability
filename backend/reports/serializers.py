from rest_framework import serializers
from .models import EcoActionSubmission, DailyCarbonReport


class EcoActionSubmissionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = EcoActionSubmission
        fields = [
            'id', 'username', 'title', 'category', 'description',
            'proof_image', 'points', 'status', 'submitted_at', 'reviewed_at',
        ]
        read_only_fields = ['id', 'username', 'points', 'status', 'submitted_at', 'reviewed_at']


class DailyCarbonReportSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DailyCarbonReport
        fields = '__all__'
        read_only_fields = ['id', 'username', 'user', 'transport_co2', 'energy_co2', 'water_co2', 'waste_co2', 'total_co2']


class AdminEcoActionSubmissionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = EcoActionSubmission
        fields = [
            'id', 'username', 'title', 'category', 'description',
            'proof_image', 'points', 'status', 'submitted_at', 'reviewed_at',
        ]
        read_only_fields = ['id', 'username', 'title', 'category', 'description', 'proof_image', 'submitted_at']

