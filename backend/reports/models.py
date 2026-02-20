from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from users.models import UserProfile


class EcoActionSubmission(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    proof_image = models.ImageField(upload_to='proofs/')

    points = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    # 🔐 Prevent double crediting
    points_awarded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
    

# 🔥 SIGNAL: Update user profile when verified
@receiver(post_save, sender=EcoActionSubmission)
def update_user_points(sender, instance, created, **kwargs):

    # Only run when:
    # 1. Not newly created
    # 2. Status is verified
    # 3. Points not already awarded
    if not created and instance.status == "verified" and not instance.points_awarded:

        profile = UserProfile.objects.get(user=instance.user)

        # Add points to user's carbon credits
        profile.carbon_credits += instance.points
        profile.save()

        # Mark as awarded
        instance.points_awarded = True
        instance.reviewed_at = timezone.now()
        instance.save(update_fields=["points_awarded", "reviewed_at"])