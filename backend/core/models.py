from django.db import models

class AQIData(models.Model):
    city = models.CharField(max_length=100)
    aqi_value = models.IntegerField()
    date = models.DateField()

    def __str__(self):
        return f"{self.city} - {self.aqi_value}"
