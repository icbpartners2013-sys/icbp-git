import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_core.settings')
django.setup()

from base.models import Tenant, User

def create_demo_users():
    import sys
    if 'test' not in sys.argv:
        sys.argv.append('test')

    tenant, _ = Tenant.objects.get_or_create(name='Test Firm')
    
    users_data = [
        # Staff Roles
        {'username': 'partner@test.com', 'email': 'partner@test.com', 'type': 'STAFF', 'role': 'PARTNER', 'title': 'Managing Partner'},
        {'username': 'senior.manager@test.com', 'email': 'senior.manager@test.com', 'type': 'STAFF', 'role': 'SENIOR_MANAGER', 'title': 'Senior Audit Manager'},
        {'username': 'manager@test.com', 'email': 'manager@test.com', 'type': 'STAFF', 'role': 'MANAGER', 'title': 'Tax Manager'},
        {'username': 'senior.associate@test.com', 'email': 'senior.associate@test.com', 'type': 'STAFF', 'role': 'SENIOR_ASSOCIATE', 'title': 'Senior Associate'},
        {'username': 'associate@test.com', 'email': 'associate@test.com', 'type': 'STAFF', 'role': 'ASSOCIATE', 'title': 'Staff Accountant'},
        {'username': 'intern@test.com', 'email': 'intern@test.com', 'type': 'STAFF', 'role': 'INTERN', 'title': 'Intern'},
        
        # Client Roles
        {'username': 'personal.client@test.com', 'email': 'personal.client@test.com', 'type': 'CLIENT', 'role': None, 'title': None, 'c_type': 'PERSONAL', 'c_subtype': 'General Taxpayer'},
        {'username': 'hnwi.client@test.com', 'email': 'hnwi.client@test.com', 'type': 'CLIENT', 'role': None, 'title': None, 'c_type': 'PERSONAL', 'c_subtype': 'HNWI'},
        {'username': 'business.client@test.com', 'email': 'business.client@test.com', 'type': 'CLIENT', 'role': None, 'title': None, 'c_type': 'BUSINESS', 'c_subtype': 'Private Limited Company'},
        {'username': 'startup.client@test.com', 'email': 'startup.client@test.com', 'type': 'CLIENT', 'role': None, 'title': None, 'c_type': 'BUSINESS', 'c_subtype': 'Startup'},
    ]

    for u in users_data:
        if not User.objects.filter(username=u['username']).exists():
            user = User.objects.create_user(
                username=u['username'],
                email=u['email'],
                password='Password123!',
                tenant=tenant,
                user_type=u['type'],
                staff_role=u.get('role'),
                staff_title=u.get('title'),
                client_type=u.get('c_type'),
                client_subtype=u.get('c_subtype')
            )
            print(f"Created user: {user.username} - {user.user_type}")
        else:
            print(f"User {u['username']} already exists")

if __name__ == '__main__':
    create_demo_users()
    print("Demo users created successfully!")
