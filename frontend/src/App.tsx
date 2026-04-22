import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function ClientDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [taxReturns, setTaxReturns] = useState([]);

  useEffect(() => {
    // In a real app, you would pass authentication headers here
    axios.get(`${API_URL}/ledger/api/invoices/`).then(res => setInvoices(res.data)).catch(() => {});
    axios.get(`${API_URL}/tax/api/tax_returns/`).then(res => setTaxReturns(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Client Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Billing Widget */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            Billing & Invoices
          </h2>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Tax Compliance
          </h2>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Secure Vault
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="mt-1 text-sm text-gray-500">Drag & drop files or click to upload</p>
          </div>
          <button className="mt-4 w-full bg-purple-50 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition">View All Documents</button>
        </div>

      </div>
    </div>
  );
}

function StaffDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Portal</h1>
          <p className="text-gray-500 mt-1">Welcome back. You have 3 engagements requiring review.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition">
          + New Time Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Workflow */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Active Engagements</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-sm border-b">
                    <th className="pb-2">Client</th>
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Deadline</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">Acme Corp Ltd</td>
                    <td className="py-3 text-gray-600">Statutory Audit</td>
                    <td className="py-3 text-gray-600">Oct 31, 2026</td>
                    <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Fieldwork</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">John Doe (HNWI)</td>
                    <td className="py-3 text-gray-600">ITR12 Tax Return</td>
                    <td className="py-3 text-gray-600">Nov 15, 2026</td>
                    <td className="py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Review</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">StartUp Tech</td>
                    <td className="py-3 text-gray-600">Monthly Payroll</td>
                    <td className="py-3 text-gray-600">Oct 25, 2026</td>
                    <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Recent Working Papers</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                  <span className="font-medium text-gray-700">Bank_Reconciliation_Q3.xlsx</span>
                </div>
                <span className="text-xs text-gray-500">Prepared by A. Smith</span>
              </li>
              <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                  <span className="font-medium text-gray-700">Trial_Balance_Draft.pdf</span>
                </div>
                <span className="text-xs text-red-500 font-medium">Pending Review</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Sidebar */}
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

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border rounded-lg transition">Submit Expenses</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border rounded-lg transition">Request Leave</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border rounded-lg transition">Firm Directory</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        
        {/* Global Navigation */}
        <header className="bg-slate-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 font-bold text-xl tracking-wider text-blue-400">
                  <span className="text-white">ERP</span>Core
                </div>
                <div className="hidden md:block ml-10">
                  <div className="flex items-baseline space-x-4">
                    <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Client Portal</Link>
                    <Link to="/staff" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Staff Portal</Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
