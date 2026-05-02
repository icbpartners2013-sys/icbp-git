"""
Custom django-allauth adapters for ICBP.

After a social (Google / LinkedIn OIDC) login the flow is:
  allauth callback → SocialAccountAdapter hooks → LOGIN_REDIRECT_URL
  → /accounts/oauth-complete/ → JWT tokens issued → React dashboard

Key behaviours:
  1. Auto-signup — skip the confirmation form for first-time social logins.
  2. Auto-connect — if a user with the same email already exists, attach the
     social account silently instead of showing a "connect?" form.
  3. New-user setup — create a Tenant and set user_type='CLIENT' for users
     that arrive via social login (they don't go through register_user).
  4. Post-login redirect — route to the correct React dashboard based on
     user_type (STAFF → /staff/dashboard, CLIENT → /client/dashboard).
"""

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


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
        Return True unconditionally so allauth never shows the sign-up
        confirmation form for social logins.
        """
        return True

    # ── 2. Auto-connect to an existing account with the same email ───────────
    def pre_social_login(self, request, sociallogin):
        """
        Called just before the social login is processed.

        If the social account is new but the provider supplied an email that
        already belongs to a Django user, silently connect the social account
        to that user instead of triggering the sign-up / connect flow.
        """
        if sociallogin.is_existing:
            return  # already linked — nothing to do

        if not sociallogin.email_addresses:
            return  # no email provided by the provider

        from base.models import User
        for email_address in sociallogin.email_addresses:
            try:
                existing_user = User.objects.get(email__iexact=email_address.email)
                sociallogin.connect(request, existing_user)
                return
            except User.DoesNotExist:
                continue

    # ── 3. Create Tenant + set user_type for brand-new social users ──────────
    def save_user(self, request, sociallogin, form=None):
        """
        Called when a new user is created via social signup.
        Wraps the default save to add a Tenant and set user_type='CLIENT'.
        """
        user = super().save_user(request, sociallogin, form=form)

        # Only set up tenant/user_type once (new users won't have a tenant yet)
        if not getattr(user, 'tenant_id', None):
            from base.models import Tenant
            tenant_name = f"{user.first_name} {user.last_name}".strip() or user.email
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
