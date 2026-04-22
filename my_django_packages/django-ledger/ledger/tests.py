from rest_framework.test import APITestCase
from rest_framework import status
from base.models import Tenant, User
from .models import Invoice, Expense
import datetime

class LedgerAPITests(APITestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Firm")
        
        self.staff = User.objects.create_user(username="staff", password="123", user_type="STAFF", tenant=self.tenant)
        self.client_1 = User.objects.create_user(username="c1", password="123", user_type="CLIENT", tenant=self.tenant)
        self.client_2 = User.objects.create_user(username="c2", password="123", user_type="CLIENT", tenant=self.tenant)

        # Create invoices
        self.inv_1 = Invoice.objects.create(tenant=self.tenant, client=self.client_1, amount=500.00, due_date=datetime.date.today())
        self.inv_2 = Invoice.objects.create(tenant=self.tenant, client=self.client_2, amount=1500.00, due_date=datetime.date.today())

        # Create expense
        self.exp_1 = Expense.objects.create(tenant=self.tenant, staff=self.staff, amount=50.00, description="Travel", date_incurred=datetime.date.today())

    def test_client_invoice_isolation(self):
        self.client.force_authenticate(user=self.client_1)
        response = self.client.get('/ledger/api/invoices/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['amount']), 500.00)

    def test_staff_sees_all_invoices(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.get('/ledger/api/invoices/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_client_cannot_access_expenses(self):
        self.client.force_authenticate(user=self.client_1)
        response = self.client.get('/ledger/api/expenses/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
