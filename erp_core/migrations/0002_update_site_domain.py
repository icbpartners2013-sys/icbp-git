from django.db import migrations


def update_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.filter(id=1).update(
        domain='icbp-git.onrender.com',
        name='ICBP',
    )


def revert_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.filter(id=1).update(
        domain='example.com',
        name='example.com',
    )


class Migration(migrations.Migration):

    dependencies = [
        ('erp_core', '0001_initial'),
        ('sites', '0002_alter_domain_unique'),
    ]

    operations = [
        migrations.RunPython(update_site, revert_site),
    ]
