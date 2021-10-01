from django.db import models

from django.contrib.auth.models import AbstractUser


""" Overide user model to be able to add custom fields"""


class User(AbstractUser):
    pass
