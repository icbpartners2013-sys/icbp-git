"""
Custom django-allauth adapters for ICBP.

After a social (Google / LinkedIn OIDC) login the flow is:
  allauth callback → SocialAccountAdapter hooks → LOGIN_REDIRECT_URL
  → /accounts/oauth-complete/ → JWT tokens issued → React dashboard

Key behaviours:
  1. Auto-signup  — skip the sign-up confirmation form for first-time logins.
  2. Auto-connect — if a user with the same e-mail already exists, attach the
     social account silently, log the user in and redirect; no form is shown.
     (Settings SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT handle this at
     the allauth level; pre_social_login is an explicit belt-and-suspenders.)
  3. New-user setup — create a Tenant and set user_type='CLIENT' for users
     that arrive via social login (they bypass register_user).
  4. Post-login redirect — route to the correct React dashboard based on
     user_type (STAFF → /staff/dashboard, CLIENT → /client/dashboard).
"""

from django.contrib.auth import login as auth_login
from django.shortcuts import redirect

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.core.exceptions import ImmediateHttpResponse


class AccountAdapter(DefaultAccountAdapter):
    """Redirect after normal (email/password) login based on user_type."""

    def get_login_redirect_url(self, request):
        user = request.user
        if hasattr(user, 'user_type') and user.user_type == 'STAFF':
            return '/accounts/oauth-complete/?next=/staff/dashboard'
        return '/accounts/oauth-complete/?next=/client/dashboard'


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    """Handle social (Google / LinkedIn) logins end-to-end."""

    # ── 1. Always allow auto-signup ──────────────────────────────────────────
    def is_auto_signup_allowed(self, request, sociallogin):
        """
        Always True — allauth will never show the sign-up confirmation form.
        """
        return True

    # ── 2. Auto-connect + login when email already exists ───────────────────
    def pre_social_login(self, request, sociallogin):
        """
        Called just before the social login is processed.

        If the social account is brand-new but the provider e-mail already
        belongs to a Django user, silently:
          1. connect the social account to that user
          2. log them in via Django's auth layer
          3. redirect to oauth_complete (which issues JWT tokens)
        This prevents the "an account already exists…" form from appearing.
        """
        if sociallogin.is_existing:
            return  # already linked — normal login flow handles it

        if not sociallogin.email_addresses:
            return  # provider gave no email — nothing to match on

        from base.models import User

        for email_address in sociallogin.email_addresses:
            try:
                existing_user = User.objects.get(email__iexact=email_address.email)
            except User.DoesNotExist:
                continue

            # Connect the social account to the existing user (saves the link)
            sociallogin.connect(request, existing_user)

            # Log the user in so the session is established
            existing_user.backend = (
                'allauth.account.auth_backends.AuthenticationBackend'
            )
            auth_login(request, existing_user)

            # Short-circuit the rest of the allauth signup/connect flow
            raise ImmediateHttpResponse(redirect('/accounts/oauth-complete/'))

    # ── 3. Create Tenant + set user_type for brand-new social users ──────────
    def save_user(self, request, sociallogin, form=None):
        """
        Called when a genuinely new user is created via social sign-up.
        Wraps the default save to add a Tenant and set user_type='CLIENT'.
        """
        user = super().save_user(request, sociallogin, form=form)

        if not getattr(user, 'tenant_id', None):
            from base.models import Tenant
            tenant_name = (
                f"{user.first_name} {user.last_name}".strip() or user.email
            )
            tenant = Tenant.objects.create(name=tenant_name)
            user.tenant = tenant
            user.user_type = 'CLIENT'
            user.save(update_fields=['tenant', 'user_type'])

        return user

    # ── 4. Post-login redirect ────────────────────────────────────────────────
    def get_connect_redirect_url(self, request, socialaccount):
        """Redirect to the correct dashboard after a social account connect."""
        user = request.user
        if hasattr(user, 'user_type') and user.user_type == 'STAFF':
            return '/accounts/oauth-complete/?next=/staff/dashboard'
        return '/accounts/oauth-complete/?next=/client/dashboard'
