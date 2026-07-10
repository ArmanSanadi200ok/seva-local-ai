import users.managers
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(
                choices=[
                    ('customer', 'Customer'),
                    ('vendor', 'Vendor'),
                    ('admin', 'Admin'),
                ],
                db_index=True,
                default='customer',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.CharField(
                blank=True,
                db_index=True,
                help_text='E.164 format, e.g. +919876543210',
                max_length=15,
                null=True,
                unique=True,
            ),
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', users.managers.UserManager()),
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(blank=True, default='', max_length=254),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['role', 'is_active'], name='users_user_role_0bfc4d_idx'),
        ),
    ]
