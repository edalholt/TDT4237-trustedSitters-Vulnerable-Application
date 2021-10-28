from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.


class Child(models.Model):

    parent = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, blank=False)

    name = models.CharField(max_length=16)

    guardians = models.ManyToManyField(
        get_user_model(), related_name='children', blank=True)

    info = models.TextField()
