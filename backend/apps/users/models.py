from django.db import models

from django.contrib.auth.models import AbstractUser
from encrypted_model_fields.fields import EncryptedCharField

""" Overide user model to be able to add custom fields"""


class User(AbstractUser):
    mfa_token = EncryptedCharField(max_length = 50, null=True, blank=True)
    mfa_active = models.BooleanField(default=False, blank=True)
