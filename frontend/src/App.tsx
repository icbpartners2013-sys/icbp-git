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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/token/`, { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setToken(res.data.access);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Secure Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 font-bold transition">Sign In</button>
        </form>
      </div>
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
