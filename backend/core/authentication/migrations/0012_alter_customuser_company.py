# Generated by Django 5.1.5 on 2025-03-05 19:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_alter_customuser_company'),
        ('users', '0005_alter_request_respondedusers_alter_review_reviewee_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.company'),
        ),
    ]
