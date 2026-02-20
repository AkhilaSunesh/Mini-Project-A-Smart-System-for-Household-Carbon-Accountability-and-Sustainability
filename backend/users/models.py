from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    carbon_credits = models.FloatField(default=0)
    total_emission = models.FloatField(default=0)
    role = models.CharField(max_length=20, default="user")  # user / admin

    def __str__(self):
        return f"{self.user.username} Profile"


# 🔥 Automatically create profile when a new user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


# 🔥 Save profile whenever user is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'userprofile'):
        instance.userprofile.save()