"""
Django settings for trustedsitters project.

Generated by 'django-admin startproject' using Django 3.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os

from pathlib import Path
from datetime import timedelta
import os.path

# The PRODUCTION variable decides how the static files are handeled in wsgi.py
# The variable is set to 'True' (string) when running with docker
PRODUCTION = os.getenv('PRODUCTION', False)

# Get environment variables
GROUP_ID = os.environ.get("GROUP_ID", "3000")
PORT_PREFIX = os.environ.get("PORT_PREFIX", "")
DOMAIN = os.environ.get("DOMAIN", "localhost")
PROTOCOL = os.environ.get("PROTOCOL", "http")

# Set the URL used for redirecting
# URL in local development will not find environment variables and looks like: 'http://localhost:3000' (redirect to node)
# URL in local production with docker can look like this: 'http://localhost:21190', where 190 is the GROUP_ID
# URL in remote production with docker can look like this: 'http://molde.idi.ntnu.no:21190', where 190 is the GROUP_ID
URL = PROTOCOL + '://' + DOMAIN + ':' + PORT_PREFIX + GROUP_ID

# Email configuration
# The host must be running within NTNU's VPN (vpn.ntnu.no) to allow this config
# Usage: https://docs.djangoproject.com/en/3.1/topics/email/#obtaining-an-instance-of-an-email-backend
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.stud.ntnu.no"

#Email sent from server should be encrypted
EMAIL_USE_TLS = False
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL = "tdt4237-group" + GROUP_ID + " " + "<noreply@idi.ntnu.no>"
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

#The secret key should not be stored in plaintext in the application, but in an .env file accessed through __init__.py -Frank
SECRET_KEY = 'asølkjwojdw09wdlg6u=986qz+fh2t!dj-i%)s*vebg@w&r92p2ci(ixc_25cm5!t'

#The field encryption key should not be stored here in plaintext, but in an .env file accessed through __init__.py -Frank
FIELD_ENCRYPTION_KEY = os.environ.get('FIELD_ENCRYPTION_KEY', 'yXhjluyPu6bYlul9wyAaHW2CT25ky9W7TKC7h8y166E=')

#Debug should be false in production, to hide debug response (error 404 instead)
DEBUG = True

ALLOWED_HOSTS = [
    # Hosts for local development
    '127.0.0.1',
    'localhost',
    # Hosts for production
    'molde.idi.ntnu.no',
]

CORS_ALLOWED_ORIGINS = [
    # Allow requests from node app in development
    "http://localhost:3000",
    # Allow requests from node app in production
    "http://localhost:5000",
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'apps.adverts.apps.AdvertsConfig',
    'apps.users.apps.UsersConfig',
    'apps.children.apps.ChildrenConfig',
    'apps.offers.apps.OffersConfig',
    'encrypted_model_fields',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'trustedsitters.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'trustedsitters.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


AUTH_USER_MODEL = "users.User"
# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Very insecure to store passwords unsalted
# From django source code (https://github.com/django/django/blob/1.6.1/django/contrib/auth/hashers.py#L449):
"""
Incredibly insecure algorithm that you should *never* use; stores unsalted
MD5 hashes without the algorithm prefix, also accepts MD5 hashes with an
empty salt.
This class is implemented because Django used to store passwords this way
and to accept such password hashes. Some older Django installs still have
these values lingering around so we need to handle and upgrade them
properly.
"""

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.UnsaltedMD5PasswordHasher',
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/
# This is only relevant in production (running with docker)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# MEDIA FILES
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}

"The time values for these tokens are too great, also i cannot see that tokens are deletet on browser close. -Frank" 
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=6000),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=15),
    'ROTATE_REFRESH_TOKENS': True,
}
