# Generated by Django 4.2 on 2023-04-16 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='product_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]