import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Receipt, Calculator, Lock, UploadCloud, BellRing, LayoutDashboard, FolderOpen, PieChart, LogOut, CheckSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [taxReturns, setTaxReturns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/ledger/api/invoices/`).then(res => setInvoices(res.data)).catch(() => {});
    axios.get(`${API_URL}/tax/api/tax_returns/`).then(res => setTaxReturns(res.data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans w-full absolute top-0 left-0 z-50">
      
      {/* Sidebar Admin Nav */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <img src="/logo-light.jpg" alt="ICBP Logo" className="h-8 w-auto rounded mr-3" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=1d4ed8&color=fff'; }} />
          <span className="font-bold text-lg text-white">Client Portal</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">OVERVIEW</p>
          <Link to="/client/dashboard" className="flex items-center gap-3 px-3 py-2 bg-icbp-blue-600 text-white rounded-md transition"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/client/documents" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><FolderOpen size={18} /> Documents</Link>
          <Link to="/client/tasks" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><CheckSquare size={18} /> Tasks</Link>
          
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">SERVICES</p>
          <Link to="/client/billing" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Receipt size={18} /> Billing & Invoices</Link>
          <Link to="/client/personal/income-tax" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Calculator size={18} /> Tax Returns</Link>
          <Link to="/client/business/company-secretarial" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><PieChart size={18} /> CIPC & Secretarial</Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Admin Nav */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <img src="/logo-light.jpg" alt="ICBP Logo" className="h-8 w-auto rounded mr-3" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=1d4ed8&color=fff'; }} />
          <span className="font-bold text-lg text-white">Client Portal</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">OVERVIEW</p>
          <Link to="/client/dashboard" className="flex items-center gap-3 px-3 py-2 bg-icbp-blue-600 text-white rounded-md transition"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/client/documents" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><FolderOpen size={18} /> Documents</Link>
          <Link to="/client/tasks" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><CheckSquare size={18} /> Tasks</Link>
          
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">SERVICES</p>
          <Link to="/client/billing" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Receipt size={18} /> Billing & Invoices</Link>
          <Link to="/client/personal/income-tax" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Calculator size={18} /> Tax Returns</Link>
          <Link to="/client/business/company-secretarial" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><PieChart size={18} /> CIPC & Secretarial</Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">Client User</p>
              <p className="text-xs text-slate-500">Business Account</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-icbp-blue-100 text-icbp-blue-700 flex items-center justify-center font-bold border border-icbp-blue-200">
              CU
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="flex justify-between items-center border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Welcome back!</h1>
              <p className="text-slate-500 mt-1">Here is a summary of your active accounts and services.</p>
            </div>
            <Button variant="default" className="gap-2"><UploadCloud size={18}/> Upload Document</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Billing Widget */}
        <Card className="border-t-4 border-t-icbp-blue-500 hover:shadow-md transition">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-icbp-blue-600 rounded-lg"><Receipt size={24}/></div>
              <div>
                <CardTitle className="text-xl">Billing & Invoices</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No pending invoices.</p>
            ) : (
              <ul className="space-y-3">
                {invoices.map((inv: any) => (
                  <li key={inv.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-600 font-medium">INV-{inv.id.toString().padStart(4, '0')}</span>
                    <span className={`font-bold ${inv.status === 'UNPAID' ? 'text-rose-500' : 'text-emerald-500'}`}>${inv.amount}</span>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" className="w-full mt-6 text-icbp-blue-600 border-icbp-blue-200 hover:bg-blue-50">View Statement</Button>
          </CardContent>
        </Card>

        {/* Tax Returns Widget */}
        <Card className="border-t-4 border-t-emerald-500 hover:shadow-md transition">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Calculator size={24}/></div>
              <div>
                <CardTitle className="text-xl">Tax Compliance</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {taxReturns.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No active tax filings.</p>
            ) : (
              <ul className="space-y-3">
                {taxReturns.map((tax: any) => (
                  <li key={tax.id} className="flex flex-col text-sm border-b border-slate-100 pb-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-800">{tax.tax_year} {tax.return_type}</span>
                      <span className="text-slate-500">{tax.status}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Due: {tax.due_date}</div>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" className="w-full mt-6 text-emerald-600 border-emerald-200 hover:bg-emerald-50">Open Tax Organizer</Button>
          </CardContent>
        </Card>

        {/* Document Vault Widget */}
        <Card className="border-t-4 border-t-purple-500 hover:shadow-md transition">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Lock size={24}/></div>
              <div>
                <CardTitle className="text-xl">Secure Vault</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-purple-300 transition cursor-pointer group">
              <UploadCloud size={32} className="text-slate-400 group-hover:text-purple-500 transition mb-3" />
              <p className="text-sm font-medium text-slate-600">Drag & drop files</p>
              <p className="text-xs text-slate-400 mt-1">or click to browse</p>
            </div>
            <Button variant="outline" className="w-full mt-6 text-purple-600 border-purple-200 hover:bg-purple-50">View All Documents</Button>
          </CardContent>
        </Card>
      </div>

          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-lg mt-8 lg:col-span-3">
            <CardContent className="flex items-center justify-between p-8">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2"><BellRing className="text-amber-400" /> Action Required</h3>
                <p className="text-slate-300 mt-2">You have 2 documents pending your electronic signature.</p>
              </div>
              <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8">Review Documents</Button>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
}
