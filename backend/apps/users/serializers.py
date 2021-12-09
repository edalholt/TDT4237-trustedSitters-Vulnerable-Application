from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from django.utils.encoding import force_bytes, force_text
from rest_framework.exceptions import AuthenticationFailed


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data


class RegisterSerializer(UserSerializer):
    password = serializers.CharField(
        max_length=128, min_length=1, write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        email = validated_data["email"]
        email_subject = "Activate your account"
        uid = user.pk
        domain = get_current_site(self.context["request"])
        link = reverse('verify-email', kwargs={"uid": uid, "status": 1})

        url = f"{settings.PROTOCOL}://{domain}{link}"

        mail = EmailMessage(
            email_subject,
            url,
            None,
            [email],
        )
        mail.send(fail_silently=False)

        return user

    def validate(self, data):

        # get the password from the data
        password = data.get('password')

        errors = dict()
        try:
            # validate the password and catch the exception
            validate_password(password=password)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(RegisterSerializer, self).validate(data)


class ResetPasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['email', "username"]


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    password1 = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uid = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'password1', 'token', 'uid']

    def validate(self, attrs):
        password = attrs.get('password')
        password1 = attrs.get('password1')
        token = attrs.get('token')
        uid = attrs.get('uid')

        id = force_text(urlsafe_base64_decode(uid))
        user = get_user_model().objects.get(id=id)
        username = force_text(urlsafe_base64_decode(token))
        errorMessage = dict()
        if not username == user.username:

            errorMessage['message'] = 'The reset link is invalid'
            raise serializers.ValidationError(errorMessage)

        try:
            validate_password(password)
        except exceptions.ValidationError as error:
            errorMessage['message'] = list(error.messages)

        if errorMessage:
            raise serializers.ValidationError(errorMessage)

        if password != password1:
            raise serializers.ValidationError("Passwords must match!")

        user.set_password(password)
        user.save()

        return user
