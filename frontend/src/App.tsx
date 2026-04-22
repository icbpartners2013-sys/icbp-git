import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axios Interceptor for injecting JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Login({ setToken }: { setToken: (token: string | null) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'CLIENT' | 'STAFF'>('CLIENT');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/token/`, { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setToken(res.data.access);
      
      // Navigate based on selected tab logic
      if (loginType === 'STAFF') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Firm Logo</span>
        </div>
        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">Help / Support</a>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-100">
          <div className="bg-slate-900 py-6 text-center">
            <h2 className="text-white text-xl font-bold tracking-wide">WELCOME TO THE SECURE PORTAL</h2>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setLoginType('CLIENT')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${loginType === 'CLIENT' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 bg-gray-50'}`}
            >
              CLIENT LOGIN
            </button>
            <button 
              onClick={() => setLoginType('STAFF')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${loginType === 'STAFF' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 bg-gray-50'}`}
            >
              STAFF LOGIN
            </button>
          </div>

          <div className="p-8">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100 text-center">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="text" 
                  required 
                  className="w-full rounded-lg border-gray-300 shadow-sm border p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="name@example.com"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full rounded-lg border-gray-300 shadow-sm border p-3 pr-10 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember my username</label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-sm mt-2">
                LOG IN
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 uppercase tracking-wide text-xs font-semibold">OR LOG IN WITH</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4 11.4H1V1h10.4v10.4zm11.6 0H12.6V1H23v10.4zM11.4 23H1V12.6h10.4V23zm11.6 0H12.6V12.6H23V23z" fill="#00A4EF"/>
                  </svg>
                  Microsoft
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Security Note: This is a 256-bit encrypted connection.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <div className="space-x-4 mb-2">
          <a href="#" className="hover:text-gray-800 transition">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-800 transition">Terms of Service</a>
        </div>
        <div>© 2024 Accounting Firm Name</div>
      </footer>
    </div>
  );
}

function ClientDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [taxReturns, setTaxReturns] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/ledger/api/invoices/`).then(res => setInvoices(res.data)).catch(() => {});
    axios.get(`${API_URL}/tax/api/tax_returns/`).then(res => setTaxReturns(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Client Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Billing Widget */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Billing & Invoices</h2>
          {invoices.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No pending invoices.</p>
          ) : (
            <ul className="space-y-3">
              {invoices.map((inv: any) => (
                <li key={inv.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-600">INV-{inv.id.toString().padStart(4, '0')}</span>
                  <span className={`font-bold ${inv.status === 'UNPAID' ? 'text-red-500' : 'text-green-500'}`}>${inv.amount}</span>
                </li>
              ))}
            </ul>
          )}
          <button className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition">View Statement</button>
        </div>

        {/* Tax Returns Widget */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tax Compliance</h2>
          {taxReturns.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No active tax filings.</p>
          ) : (
            <ul className="space-y-3">
              {taxReturns.map((tax: any) => (
                <li key={tax.id} className="flex flex-col text-sm border-b pb-2">
                  <div className="flex justify-between font-medium">
                    <span>{tax.tax_year} {tax.return_type}</span>
                    <span className="text-gray-500">{tax.status}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Due: {tax.due_date}</div>
                </li>
              ))}
            </ul>
          )}
          <button className="mt-4 w-full bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition">Open Tax Organizer</button>
        </div>

        {/* Document Vault Widget */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-purple-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Secure Vault</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
            <p className="mt-1 text-sm text-gray-500">Click to upload documents</p>
          </div>
          <button className="mt-4 w-full bg-purple-50 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition">View All Documents</button>
        </div>
      </div>
    </div>
  );
}

function StaffDashboard() {
  const [engagements, setEngagements] = useState([]);
  
  useEffect(() => {
    axios.get(`${API_URL}/audit/api/engagements/`).then(res => setEngagements(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Portal</h1>
          <p className="text-gray-500 mt-1">Welcome back. You have active engagements.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition">
          + New Time Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Active Engagements</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-sm border-b">
                    <th className="pb-2">Client ID</th>
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Deadline</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {engagements.length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-500">No active engagements.</td></tr>
                  ) : (
                    engagements.map((eng: any) => (
                      <tr key={eng.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-800">Client #{eng.client}</td>
                        <td className="py-3 text-gray-600">{eng.name}</td>
                        <td className="py-3 text-gray-600">{eng.financial_year_end}</td>
                        <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">{eng.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800 text-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">My Time (This Week)</h2>
            <div className="text-4xl font-light mb-2">32.5 <span className="text-lg text-gray-400">hrs</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Billable: 28.0h</span>
              <span>Target: 40.0h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-slate-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 font-bold text-xl tracking-wider text-blue-400">
                  <span className="text-white">ERP</span>Core
                </div>
                {token && (
                  <div className="hidden md:block ml-10">
                    <div className="flex items-baseline space-x-4">
                      <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Client Portal</Link>
                      <Link to="/staff" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Staff Portal</Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {token ? (
                  <button onClick={handleLogout} className="text-sm font-bold text-red-400 hover:text-red-300">Logout</button>
                ) : (
                  <Link to="/login" className="text-sm font-bold text-blue-400 hover:text-blue-300">Login</Link>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <ClientDashboard /> : <Navigate to="/login" />} />
            <Route path="/staff" element={token ? <StaffDashboard /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
