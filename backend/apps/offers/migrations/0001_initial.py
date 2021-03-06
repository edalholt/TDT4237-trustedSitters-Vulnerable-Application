# Generated by Django 3.2.7 on 2021-10-28 20:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipient', models.TextField()),
                ('offerType', models.CharField(choices=[('GUARDIAN_OFFER', 'Guardian Offer'), ('JOB_OFFER', 'Job Offer')], default='JOB_OFFER', max_length=14)),
                ('status', models.CharField(choices=[('A', 'Accepted'), ('D', 'Declined'), ('P', 'Pending')], default='P', max_length=1)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
