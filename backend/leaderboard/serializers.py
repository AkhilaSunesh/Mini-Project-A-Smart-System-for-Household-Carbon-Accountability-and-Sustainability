from rest_framework import serializers
from users.models import UserProfile

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    rank = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['rank', 'username', 'carbon_credits']

    def get_rank(self, obj):
        profiles = UserProfile.objects.all().order_by('-carbon_credits')
        return list(profiles).index(obj) + 1