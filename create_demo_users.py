"""
ICBP Demo User Seed Script
Run: python create_demo_users.py

Credentials (all users):  Password123!

STAFF LOGINS
  partner@icbp.co.za          – Managing Partner
  alice.smith@icbp.co.za      – Senior Audit Manager
  bob.jones@icbp.co.za        – Tax Manager
  carol.lee@icbp.co.za        – Senior Associate
  dave.williams@icbp.co.za    – Intern

CLIENT LOGINS
  john.smith@demo.co.za       – Personal client only (income tax, retirement)
  sarah.johnson@demo.co.za    – Personal + Business client (HNWI with 2 entities)
  acme@demo.co.za             – Business client only (Acme Holdings Pty Ltd)
  startup@demo.co.za          – Startup / single director
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_core.settings')
django.setup()

from base.models import Tenant, User


def create_demo_users():
    tenant, _ = Tenant.objects.get_or_create(name='ICBP Demo Firm')

    users_data = [
        # ── Staff ──────────────────────────────────────────────────────────────
        {
            'username': 'partner@icbp.co.za',
            'email': 'partner@icbp.co.za',
            'first_name': 'Michael',
            'last_name': 'Anderson',
            'type': 'STAFF', 'role': 'PARTNER',
            'title': 'Managing Partner',
        },
        {
            'username': 'alice.smith@icbp.co.za',
            'email': 'alice.smith@icbp.co.za',
            'first_name': 'Alice',
            'last_name': 'Smith',
            'type': 'STAFF', 'role': 'SENIOR_MANAGER',
            'title': 'Senior Audit Manager',
        },
        {
            'username': 'bob.jones@icbp.co.za',
            'email': 'bob.jones@icbp.co.za',
            'first_name': 'Bob',
            'last_name': 'Jones',
            'type': 'STAFF', 'role': 'MANAGER',
            'title': 'Tax Manager',
        },
        {
            'username': 'carol.lee@icbp.co.za',
            'email': 'carol.lee@icbp.co.za',
            'first_name': 'Carol',
            'last_name': 'Lee',
            'type': 'STAFF', 'role': 'SENIOR_ASSOCIATE',
            'title': 'Senior Associate',
        },
        {
            'username': 'dave.williams@icbp.co.za',
            'email': 'dave.williams@icbp.co.za',
            'first_name': 'David',
            'last_name': 'Williams',
            'type': 'STAFF', 'role': 'INTERN',
            'title': 'Intern',
        },

        # ── Clients ────────────────────────────────────────────────────────────
        # Personal only
        {
            'username': 'john.smith@demo.co.za',
            'email': 'john.smith@demo.co.za',
            'first_name': 'John',
            'last_name': 'Smith',
            'type': 'CLIENT', 'role': None, 'title': None,
            'c_type': 'PERSONAL', 'c_subtype': 'General Taxpayer',
        },
        # Personal + Business (HNWI with two entities)
        {
            'username': 'sarah.johnson@demo.co.za',
            'email': 'sarah.johnson@demo.co.za',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'type': 'CLIENT', 'role': None, 'title': None,
            'c_type': 'PERSONAL', 'c_subtype': 'HNWI',
        },
        # Business only – private company
        {
            'username': 'acme@demo.co.za',
            'email': 'acme@demo.co.za',
            'first_name': 'Acme',
            'last_name': 'Holdings',
            'type': 'CLIENT', 'role': None, 'title': None,
            'c_type': 'BUSINESS', 'c_subtype': 'Private Limited Company',
        },
        # Startup / single director
        {
            'username': 'startup@demo.co.za',
            'email': 'startup@demo.co.za',
            'first_name': 'Liam',
            'last_name': 'Ndlovu',
            'type': 'CLIENT', 'role': None, 'title': None,
            'c_type': 'BUSINESS', 'c_subtype': 'Startup',
        },
    ]

    for u in users_data:
        if User.objects.filter(username=u['username']).exists():
            print(f"  ✓ exists  : {u['username']}")
            continue
        user = User.objects.create_user(
            username=u['username'],
            email=u['email'],
            password='Password123!',
            first_name=u.get('first_name', ''),
            last_name=u.get('last_name', ''),
            tenant=tenant,
            user_type=u['type'],
            staff_role=u.get('role'),
            staff_title=u.get('title'),
            client_type=u.get('c_type'),
            client_subtype=u.get('c_subtype'),
        )
        print(f"  + created : {user.username}  [{user.user_type}]")


if __name__ == '__main__':
    print("Creating ICBP demo users …")
    create_demo_users()
    print("Done! All users have password: Password123!")
