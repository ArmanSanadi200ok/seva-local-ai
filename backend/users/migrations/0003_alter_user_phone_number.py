from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_phone_auth_and_roles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(
                db_index=True,
                help_text='E.164 format, e.g. +919876543210',
                max_length=15,
                unique=True,
            ),
        ),
    ]
