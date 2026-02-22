from django.db import models
from django.contrib.auth.models import User


class RewardProject(models.Model):  # Keeping name to avoid migration issues
    organization_name = models.CharField(max_length=200)
    description = models.TextField()
    credits_available = models.FloatField()
    price_per_credit = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.organization_name

    class Meta:
        verbose_name = "Credit Market"
        verbose_name_plural = "Credit Market"


class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(RewardProject, on_delete=models.CASCADE)
    credits_bought = models.FloatField()
    total_price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.credits_bought} credits from {self.project.organization_name}"