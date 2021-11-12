from rest_framework import serializers

from .models import Child


class ChildSerializer(serializers.ModelSerializer):

    guardians = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='username')
    parent = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    class Meta:
        model = Child
        fields = ('id', 'parent', 'name', 'info', 'guardians')
        read_only_fields = ['parent']