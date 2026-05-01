/**
 * OAuthCallback — intermediary page for Google / LinkedIn social login.
 *
 * Flow:
 *  1. User clicks "Sign in with Google" → browser goes to /accounts/google/login/
 *  2. Google authenticates → callback to /accounts/google/login/callback/
 *  3. Django allauth processes → redirects to /accounts/oauth-complete/
 *  4. oauth_complete view issues JWT tokens → redirects to /oauth-callback?access=...&refresh=...&next=/xxx/dashboard
 *  5. THIS PAGE reads tokens from URL, stores them in localStorage, then navigates to the dashboard.
 */
import { useEffect, useState } from 'react';

export default function OAuthCallback() {
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get('access');
    const refresh = params.get('refresh');
    const next = params.get('next') || '/client/dashboard';

    if (access && refresh) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      // Full reload so App.tsx re-reads the token and sets up routes correctly
      window.location.href = next;
    } else {
      setStatus('error');
      setErrorMsg('No tokens received from server. Please try signing in again.');
    }
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-icbp-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-700 mb-3">Sign-in Failed</h2>
          <p className="text-gray-600 text-sm mb-6">{errorMsg}</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-icbp-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Signing you in…</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
