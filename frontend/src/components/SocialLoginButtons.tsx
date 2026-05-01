/**
 * Social login buttons for Google and LinkedIn.
 *
 * These redirect the browser to the Django backend's OAuth endpoints.
 * Backend must have django-allauth (or social-django) configured with
 * Google and LinkedIn providers.
 *
 * Typical endpoints:
 *   Google:   /api/auth/social/google/login/
 *   LinkedIn: /api/auth/social/linkedin_oauth2/login/
 *
 * After successful OAuth, the backend should set the JWT tokens and
 * redirect back to /client/dashboard (or a configurable next URL).
 */

import { backendUrl } from '../utils/api';

// These match the django-allauth URL patterns registered at path('accounts/', include('allauth.urls'))
const GOOGLE_OAUTH_URL = backendUrl('/accounts/google/login/');
const LINKEDIN_OAUTH_URL = backendUrl('/accounts/linkedin_oauth2/login/');

interface SocialLoginButtonsProps {
  mode?: 'signin' | 'signup';
}

export default function SocialLoginButtons({ mode = 'signin' }: SocialLoginButtonsProps) {
  const label = mode === 'signup' ? 'Sign up' : 'Sign in';

  const handleGoogle = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  const handleLinkedIn = () => {
    window.location.href = LINKEDIN_OAUTH_URL;
  };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400">
          <span className="bg-white px-3">or continue with</span>
        </div>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm"
      >
        {/* Google SVG logo */}
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.14 0 5.96 1.08 8.18 2.84l6.1-6.1C34.46 3.19 29.5 1 24 1 14.82 1 7.13 6.48 3.96 14.24l7.12 5.53C12.76 13.63 17.93 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.98-2.2 5.5-4.68 7.18l7.18 5.57C43.3 37.37 46.5 31.34 46.5 24.5z"/>
          <path fill="#FBBC05" d="M11.08 28.23A14.51 14.51 0 0 1 9.5 24c0-1.48.26-2.9.72-4.23L3.1 14.24A23.49 23.49 0 0 0 .5 24c0 3.77.9 7.34 2.49 10.49l8.09-6.26z"/>
          <path fill="#34A853" d="M24 47c5.52 0 10.15-1.83 13.53-4.97l-7.18-5.57C28.6 37.95 26.43 38.5 24 38.5c-6.07 0-11.24-4.13-12.92-9.77l-7.12 5.53C7.13 41.52 14.82 47 24 47z"/>
        </svg>
        {label} with Google
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={handleLinkedIn}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#0A66C2] rounded-lg bg-white hover:bg-blue-50 transition text-sm font-medium text-[#0A66C2] shadow-sm"
      >
        {/* LinkedIn SVG logo */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        {label} with LinkedIn
      </button>
    </div>
  );
}
