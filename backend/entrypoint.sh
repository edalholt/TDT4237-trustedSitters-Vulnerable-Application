#!/bin/sh

# Code to run after building the image

python manage.py migrate

python manage.py collectstatic

gunicorn trustedsitters.wsgi --log-file - -b 0.0.0.0:8000