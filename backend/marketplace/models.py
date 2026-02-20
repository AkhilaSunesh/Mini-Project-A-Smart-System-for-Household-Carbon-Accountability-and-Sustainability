from django.db import models
from django.contrib.auth.models import User

class CarbonCredit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    credits = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.credits} credits"


class MarketplaceTransaction(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return f"Transaction {self.id}"
