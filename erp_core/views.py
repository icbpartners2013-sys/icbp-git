from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from base.models import Tenant, User
from .models import Page
import json
import os
from urllib.parse import urlencode

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView


class ICBPTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Include role metadata so the React app can route users safely after login."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = getattr(user, 'user_type', 'CLIENT')
        token['email'] = getattr(user, 'email', '')
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_type'] = getattr(self.user, 'user_type', 'CLIENT')
        data['email'] = getattr(self.user, 'email', '')
        data['first_name'] = getattr(self.user, 'first_name', '')
        data['last_name'] = getattr(self.user, 'last_name', '')
        return data


class ICBPTokenObtainPairView(TokenObtainPairView):
    serializer_class = ICBPTokenObtainPairSerializer


@csrf_exempt
def save_puck_data(request, page_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            page = Page.objects.get(id=page_id)
            page.content = data
            page.save()
            return JsonResponse({"status": "success"})
        except Page.DoesNotExist:
            return JsonResponse({"error": "Page not found"}, status=404)
    return JsonResponse({"error": "Invalid request"}, status=400)


def get_puck_data(request, page_id):
    try:
        page = Page.objects.get(id=page_id)
        return JsonResponse(page.content)
    except Page.DoesNotExist:
        return JsonResponse({}, status=404)


@csrf_exempt
def register_user(request):
    """Create a client user from the React registration form."""
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON payload'}, status=400)

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    first_name = (data.get('first_name') or '').strip()
    last_name = (data.get('last_name') or '').strip()
    account_type = (data.get('account_type') or 'personal').strip().lower()
    businesses = data.get('businesses') or []

    if not email:
        return JsonResponse({'email': ['Email address is required.']}, status=400)
    if not password:
        return JsonResponse({'password': ['Password is required.']}, status=400)
    if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
        return JsonResponse({'email': ['An account with this email already exists.']}, status=400)

    user = User(username=email, email=email, first_name=first_name, last_name=last_name)
    try:
        validate_password(password, user=user)
    except ValidationError as exc:
        return JsonResponse({'password': exc.messages}, status=400)

    client_type = 'BUSINESS' if account_type == 'business' else 'PERSONAL'
    tenant_name = f"{first_name} {last_name}".strip() or email
    if client_type == 'BUSINESS' and businesses:
        tenant_name = (businesses[0].get('name') or tenant_name).strip() or tenant_name

    with transaction.atomic():
        tenant = Tenant.objects.create(name=tenant_name)
        user.tenant = tenant
        user.user_type = 'CLIENT'
        user.client_type = client_type
        if client_type == 'BUSINESS' and businesses:
            user.client_subtype = businesses[0].get('type') or 'Business'
        user.set_password(password)
        user.save()

    return JsonResponse({
        'id': user.id,
        'email': user.email,
        'user_type': user.user_type,
        'client_type': user.client_type,
    }, status=201)


@login_required
def oauth_complete(request):
    """
    Called by allauth after a successful social login.

    Issues JWT tokens for the React frontend and redirects to the correct
    dashboard based on the user's user_type (STAFF → /staff/dashboard,
    CLIENT → /client/dashboard).

    The React OAuthCallback page reads the tokens from the URL query string,
    stores them in localStorage, then navigates to the dashboard.
    """
    user = request.user

    # Determine destination dashboard
    next_url = request.GET.get('next', '')
    if not next_url:
        user_type = getattr(user, 'user_type', 'CLIENT')
        next_url = '/staff/dashboard' if user_type == 'STAFF' else '/client/dashboard'

    # Issue JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    frontend_url = os.environ.get('FRONTEND_URL', '').rstrip('/')
    if not frontend_url:
        host = request.get_host().split(':')[0]
        is_local = host in {'localhost', '127.0.0.1', '0.0.0.0'}
        frontend_url = 'http://localhost:5173' if is_local else 'https://icbp-frontend.onrender.com'

    # Redirect to React with tokens in query params.
    # The React OAuthCallback component stores them and navigates to `next`.
    query = urlencode({
        'access': access_token,
        'refresh': refresh_token,
        'next': next_url,
    })
    redirect_url = f"{frontend_url}/oauth-callback?{query}"
    return HttpResponseRedirect(redirect_url)
