# Generated by Django 3.2.4 on 2021-11-25 12:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_mfa_hash'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='mfa_hash',
            new_name='mfa_token',
        ),
    ]
