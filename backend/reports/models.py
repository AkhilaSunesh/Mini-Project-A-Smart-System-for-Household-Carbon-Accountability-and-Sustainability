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


class DailyCarbonReport(models.Model):
    # EMISSION FACTORS (kg CO2 per unit)
    TRANSPORT_FACTORS = {
        'car_petrol_large': 0.1730,  # >1200 cc
        'car_petrol_small': 0.1264,  # <1200 cc
        'bike_motorcycle': 0.0248,
        'bike_scooter': 0.0421,
        'bus_public': 0.0730,
        'train_rail': 0.0170,
    }
    GRID_FACTOR = 0.82  # per kWh
    LPG_FACTOR = 3.13  # per kg
    WATER_FACTORS = {
        'municipal': 1.69,  # per kL (1000L)
        'borewell': 0.67,
    }
    WASTE_FACTORS = {
        'organic_landfill': 1.29,
        'organic_composted': 0.32,
        'paper': 2.50,
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)

    # Transportation
    transport_distance = models.FloatField(default=0)  # km
    transport_vehicle_type = models.CharField(max_length=50, choices=[
        ('car_petrol_large', 'Car (Petrol >1200 cc)'),
        ('car_petrol_small', 'Car (Petrol <1200 cc)'),
        ('bike_motorcycle', 'Bike (Motorcycle)'),
        ('bike_scooter', 'Bike (Scooter)'),
        ('bus_public', 'Bus (Public)'),
        ('train_rail', 'Train (Rail)'),
    ], null=True, blank=True)

    # Electricity
    electricity_units = models.FloatField(default=0)  # kWh

    # LPG
    lpg_used = models.FloatField(default=0)  # kg

    # Water
    water_used = models.FloatField(default=0)  # Liters
    water_source = models.CharField(max_length=50, choices=[
        ('municipal', 'Municipal Supply'),
        ('borewell', 'Borewell Pump'),
    ], null=True, blank=True)

    # Waste
    waste_weight = models.FloatField(default=0)  # kg
    waste_type_method = models.CharField(max_length=50, choices=[
        ('organic_landfill', 'Organic Waste (Landfill)'),
        ('organic_composted', 'Organic Waste (Composted)'),
        ('paper', 'Paper Waste'),
    ], null=True, blank=True)

    total_co2 = models.FloatField(default=0)

    def calculate_co2(self):
        co2 = 0
        
        # 1. Transport
        if self.transport_vehicle_type in self.TRANSPORT_FACTORS:
            co2 += self.transport_distance * self.TRANSPORT_FACTORS[self.transport_vehicle_type]
        
        # 2. Electricity
        co2 += self.electricity_units * self.GRID_FACTOR
        
        # 3. LPG
        co2 += self.lpg_used * self.LPG_FACTOR
        
        # 4. Water
        if self.water_source in self.WATER_FACTORS:
            co2 += (self.water_used / 1000.0) * self.WATER_FACTORS[self.water_source]
        
        # 5. Waste
        if self.waste_type_method in self.WASTE_FACTORS:
            co2 += self.waste_weight * self.WASTE_FACTORS[self.waste_type_method]
            
        return round(co2, 4)

    def save(self, *args, **kwargs):
        self.total_co2 = self.calculate_co2()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Carbon Report - {self.user.username} - {self.date}"
    

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


# 🔥 SIGNAL: Update UserProfile.total_emission when a DailyCarbonReport is saved
@receiver(post_save, sender=DailyCarbonReport)
def update_total_emissions(sender, instance, created, **kwargs):
    profile = UserProfile.objects.get(user=instance.user)
    # Re-calculate total emissions for the user
    total = DailyCarbonReport.objects.filter(user=instance.user).aggregate(models.Sum('total_co2'))['total_co2__sum'] or 0
    profile.total_emission = round(total, 4)
    profile.save()