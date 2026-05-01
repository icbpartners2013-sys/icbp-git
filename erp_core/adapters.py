"""
Custom django-allauth adapters for ICBP.

After a social (Google / LinkedIn) OAuth login:
1. The SocialAccountAdapter.get_connect_redirect_url() is *not* used for login.
2. Instead we override ACCOUNT_ADAPTER to set LOGIN_REDIRECT_URL at runtime.
3. A dedicated view (oauth_complete) issues JWT tokens and redirects to the
   correct React dashboard with the tokens in the URL query string.
"""

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class AccountAdapter(DefaultAccountAdapter):
    """Redirect after normal (email) login based on user_type."""

    def get_login_redirect_url(self, request):
        user = request.user
        if hasattr(user, 'user_type') and user.user_type == 'STAFF':
            return '/accounts/oauth-complete/?next=/staff/dashboard'
        return '/accounts/oauth-complete/?next=/client/dashboard'


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    """Same redirect logic for social (OAuth) logins."""

    def get_connect_redirect_url(self, request, socialaccount):
        user = request.user
        if hasattr(user, 'user_type') and user.user_type == 'STAFF':
            return '/accounts/oauth-complete/?next=/staff/dashboard'
        return '/accounts/oauth-complete/?next=/client/dashboard'
