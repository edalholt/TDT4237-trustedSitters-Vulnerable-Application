from rest_framework import serializers

from .models import Advert


class AdvertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advert
        fields = ('id', 'owner', 'date', 'start_time', 'end_time','content', 'advertType')
        read_only_fields = ['owner', 'advertType']
