from rest_framework import serializers

from .models import Offer, Contract


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ('id', 'offerType', 'sender', 'recipient', 'status', 'advert')
        read_only_fields = ['sender', 'status', 'recipient']


class ContractSerializer(serializers.ModelSerializer):
    parent = serializers.SlugRelatedField(
        read_only=True, slug_field='username')
    sitter = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    class Meta:
        model = Contract
        fields = ('id', 'parent', 'sitter', 'content', 'date',
                  'start_time', 'end_time', 'finished')
