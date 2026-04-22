import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ClientDashboard() {
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
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-icbp-blue-500">
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
          <button className="mt-4 w-full bg-blue-50 text-icbp-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition">View Statement</button>
        </div>

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
