from rest_framework import serializers

from .models import Child


class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ('id', 'parent', 'name', 'info', 'guardians')
        read_only_fields = ['parent']
