from django.contrib.auth import get_user_model
from apps.users.serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework import permissions, viewsets, filters, status, generics, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.response import Response
from django.shortcuts import redirect
from django.contrib.sites.shortcuts import get_current_site
import os
from django.conf import settings
import pyotp
from .models import User
from django.core.signing import Signer


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_superuser:  # Admin users can see info of every user
            return get_user_model().objects.raw('SELECT * FROM users_user')
        else:
            # Normal users only see information about themselves
            return get_user_model().objects.raw('SELECT * FROM users_user WHERE id = %s', [self.request.user.id])


class RegistrationViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)


class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class VerificationView(generics.GenericAPIView):
    def get(self, request, uid, status):
        verified_url = settings.URL + "/verified"
        invalid_url = settings.URL + "/invalid"
        try:
            id = uid
            user = get_user_model().objects.get(pk=id)
            if status == "1":
                user.is_active = True
                user.save()
            else:
                user.is_active = False
                user.save()
                return redirect(invalid_url)

            return redirect(verified_url)

        except Exception as ex:
            pass

        return redirect(invalid_url)


class MFAView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        '''
            Creates a new secret token if the user has not activated MFA, else return current token.
        '''
        user = User.objects.get(id = request.user.id)
        if user.mfa_active==False:
            secret_key = pyotp.random_base32()
            user.mfa_token = secret_key
            user.save()
            mfa_token = pyotp.TOTP(secret_key).provisioning_uri(name=request.user.email, issuer_name='TrustedSitters')
            return Response({'mfa_token': mfa_token, 'active': user.mfa_active})
        else:
            mfa_token = pyotp.TOTP(user.mfa_token).provisioning_uri(name=request.user.email, issuer_name='TrustedSitters')
            return Response({'mfa_token': mfa_token, 'active': user.mfa_active})

    def post(self, request):
        '''
            Verifies the provided one-time-password and sets the mfa_active User field to True
        '''
        user = User.objects.get(id = request.user.id)
        secret_key = user.mfa_token
        mfa_token = pyotp.TOTP(secret_key)
        if mfa_token.verify(request.data['otp']):
            user.mfa_active=True
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

