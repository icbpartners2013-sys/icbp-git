import { useState } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';
import { Lock, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { apiUrl } from '../../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(apiUrl('/api/token/'), { username: email, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      const destination = res.data.user_type === 'STAFF' ? '/staff/dashboard' : '/client/dashboard';
      // Force full reload so App re-reads the token from localStorage
      window.location.href = destination;
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        'Invalid credentials. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-icbp-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <img
            src="/logo-dark.jpg"
            alt="ICBP Logo"
            className="h-14 mx-auto mb-4 rounded-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your ICBP account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <Alert color="failure" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email / Username</Label>
              </div>
              <TextInput
                id="email"
                name="email"
                type="text"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              color="blue"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          {/* Social login */}
          <div className="mt-6">
            <SocialLoginButtons mode="signin" />
          </div>

          <div className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 International Company Business Partners
        </p>
      </div>
    </div>
  );
}
