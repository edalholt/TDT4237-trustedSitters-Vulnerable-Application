from django.db import models
from django.contrib.auth import get_user_model
from apps.children.models import Child

# Create your models here.


class OfferType(models.TextChoices):
    GUARDIAN_OFFER = 'GUARDIAN_OFFER'
    JOB_OFFER = 'JOB_OFFER'


class OfferStatus(models.TextChoices):
    ACCEPTED = 'A'
    DECLINED = 'D'
    PENDING = 'P'


class Offer(models.Model):

    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    recipient = models.TextField()
    offerType = models.CharField(max_length=14,
                                 choices=OfferType.choices, default=OfferType.JOB_OFFER, blank=False)
    status = models.CharField(
        max_length=1, choices=OfferStatus.choices, default=OfferStatus.PENDING)
