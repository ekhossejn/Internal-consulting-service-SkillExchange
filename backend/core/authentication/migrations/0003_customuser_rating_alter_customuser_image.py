# Generated by Django 5.1.5 on 2025-03-26 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='rating',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='avatars'),
        ),
    ]
