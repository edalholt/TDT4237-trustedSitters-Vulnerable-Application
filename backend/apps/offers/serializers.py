from rest_framework import serializers

from .models import Offer


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ('id', 'offerType', 'sender', 'recipient', 'status')
        read_only_fields = ['sender', 'status', 'recipient']
