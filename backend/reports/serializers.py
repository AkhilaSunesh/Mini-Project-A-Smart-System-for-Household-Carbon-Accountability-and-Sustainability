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
        read_only_fields = ['id', 'username', 'user', 'total_co2']
