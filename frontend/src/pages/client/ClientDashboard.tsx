import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Receipt, Calculator, Lock, UploadCloud, BellRing } from 'lucide-react';

export default function ClientDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [taxReturns, setTaxReturns] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/ledger/api/invoices/`).then(res => setInvoices(res.data)).catch(() => {});
    axios.get(`${API_URL}/tax/api/tax_returns/`).then(res => setTaxReturns(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Client Portal</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here is a summary of your active accounts.</p>
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

      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-lg mt-8">
        <CardContent className="flex items-center justify-between p-8">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2"><BellRing className="text-amber-400" /> Action Required</h3>
            <p className="text-slate-300 mt-2">You have 2 documents pending your electronic signature.</p>
          </div>
          <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8">Review Documents</Button>
        </CardContent>
      </Card>

    </div>
  );
}
