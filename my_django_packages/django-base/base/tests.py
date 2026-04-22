from rest_framework.test import APITestCase
from rest_framework import status
from .models import Tenant, User, Service

class BaseAPITests(APITestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Firm")
        
        # Create Staff
        self.staff_user = User.objects.create_user(
            username="staff_member", 
            password="password123", 
            user_type="STAFF",
            tenant=self.tenant
        )
        
        # Create Clients
        self.client_1 = User.objects.create_user(
            username="client_1", 
            password="password123", 
            user_type="CLIENT",
            tenant=self.tenant
        )
        self.client_2 = User.objects.create_user(
            username="client_2", 
            password="password123", 
            user_type="CLIENT",
            tenant=self.tenant
        )

    def test_staff_can_view_all_users(self):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get('/base/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) # staff, client_1, client_2

    def test_client_can_only_view_self(self):
        self.client.force_authenticate(user=self.client_1)
        response = self.client.get('/base/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'client_1')

    def test_unauthenticated_user_access_denied(self):
        response = self.client.get('/base/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
