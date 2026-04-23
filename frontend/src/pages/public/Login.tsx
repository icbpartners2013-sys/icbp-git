import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'CLIENT' | 'STAFF'>('CLIENT');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/token/`, { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      // We will trigger a reload to reset the main layout state, or just let context handle it.
      // Since App.tsx holds state currently, we might just reload for simplicity.
      window.location.href = loginType === 'STAFF' ? '/staff/dashboard' : '/client/dashboard';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-icbp-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo-light.jpg" alt="ICBP Logo" className="h-10 w-auto rounded" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=1d4ed8&color=fff'; }} />
          <span className="font-bold text-xl tracking-wider text-icbp-blue-600">
            <span className="text-gray-800">ICBP</span> Portal
          </span>
        </div>
        <a href="#" className="text-sm font-medium text-icbp-blue-600 hover:text-icbp-blue-800">Help / Support</a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-100">
          <div className="bg-icbp-dark py-6 text-center">
            <h2 className="text-white text-xl font-bold tracking-wide">WELCOME TO THE SECURE PORTAL</h2>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button onClick={() => setLoginType('CLIENT')} className={`flex-1 py-4 text-sm font-bold transition-colors ${loginType === 'CLIENT' ? 'text-icbp-blue-600 border-b-2 border-icbp-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 bg-gray-50'}`}>
              CLIENT LOGIN
            </button>
            <button onClick={() => setLoginType('STAFF')} className={`flex-1 py-4 text-sm font-bold transition-colors ${loginType === 'STAFF' ? 'text-icbp-blue-600 border-b-2 border-icbp-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 bg-gray-50'}`}>
              STAFF LOGIN
            </button>
          </div>

          <div className="p-8">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100 text-center">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="text" required className="w-full rounded-lg border-gray-300 shadow-sm border p-3 focus:ring-icbp-blue-500 focus:border-icbp-blue-500 transition-colors" value={username} onChange={e => setUsername(e.target.value)} placeholder="name@example.com" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-icbp-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required className="w-full rounded-lg border-gray-300 shadow-sm border p-3 pr-10 focus:ring-icbp-blue-500 focus:border-icbp-blue-500 transition-colors" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-icbp-blue-600 focus:ring-icbp-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember my username</label>
              </div>

              <button type="submit" className="w-full bg-icbp-blue-600 text-white p-3 rounded-lg hover:bg-icbp-blue-700 font-bold transition-colors shadow-sm mt-2">
                LOG IN
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Demo Accounts (Password: Password123!)</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => {setUsername('partner@test.com'); setPassword('Password123!'); setLoginType('STAFF');}} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded hover:bg-slate-200">Partner</button>
                <button onClick={() => {setUsername('associate@test.com'); setPassword('Password123!'); setLoginType('STAFF');}} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded hover:bg-slate-200">Staff</button>
                <button onClick={() => {setUsername('business.client@test.com'); setPassword('Password123!'); setLoginType('CLIENT');}} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">Business</button>
                <button onClick={() => {setUsername('personal.client@test.com'); setPassword('Password123!'); setLoginType('CLIENT');}} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100">Personal</button>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500 uppercase tracking-wide text-xs font-semibold">OR LOG IN WITH</span></div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Google
                </button>
                <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Microsoft
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-center text-xs text-gray-500">
            Security Note: This is a 256-bit encrypted connection.
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <div className="space-x-4 mb-2">
          <a href="#" className="hover:text-gray-800 transition">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-800 transition">Terms of Service</a>
        </div>
        <div>© 2026 International Company Business Partners</div>
      </footer>
    </div>
  );
}
