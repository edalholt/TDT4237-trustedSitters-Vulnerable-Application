from django.db import models

# Create your models here.


class Toy(models.Model):

    price = models.IntegerField()

    description = models.TextField()
