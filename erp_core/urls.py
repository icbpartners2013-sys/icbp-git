"""
URL configuration for erp_core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenRefreshView

def home(request):
    return HttpResponse("Welcome to the Accounting ERP API/System. Please navigate to /admin or specific app endpoints.")

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),

    # JWT auth
    path('api/token/', views.ICBPTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.register_user, name='register_user'),

    # dj-rest-auth (standard login/logout/register + social)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # django-allauth (handles OAuth browser redirects & callbacks)
    # Google callback lives at: /accounts/google/login/callback/
    path('accounts/oauth-complete/', views.oauth_complete, name='oauth_complete'),
    path('accounts/', include('allauth.urls')),

    # App APIs
    path('base/', include('base.urls')),
    path('audit/', include('audit.urls')),
    path('tax/', include('tax.urls')),
    path('ledger/', include('ledger.urls')),

    # Puck page data
    path('api/pages/<int:page_id>/save/', views.save_puck_data),
    path('api/pages/<int:page_id>/content/', views.get_puck_data),
]
