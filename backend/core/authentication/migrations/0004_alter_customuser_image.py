# Generated by Django 4.2.20 on 2025-03-30 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_customuser_rating_alter_customuser_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='image',
            field=models.ImageField(default='avatars/default.jpg', upload_to='avatars'),
        ),
    ]
