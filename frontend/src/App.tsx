import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  
  useEffect(() => {
    // Basic example of fetching from our Django API
    axios.get(`${API_URL}/ledger/api/invoices/`)
      .then(res => setInvoices(res.data))
      .catch(err => console.error("API Error or Not Authenticated:", err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl mb-2">My Invoices</h2>
        {invoices.length === 0 ? (
          <p className="text-gray-500">No invoices found or not authenticated.</p>
        ) : (
          <ul>
            {invoices.map((inv: any) => (
              <li key={inv.id} className="border-b py-2 flex justify-between">
                <span>Invoice #{inv.id}</span>
                <span className="font-semibold">${inv.amount} - {inv.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-blue-800 text-white p-4 flex gap-4">
          <div className="font-bold text-xl mr-auto">Accounting ERP</div>
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/staff" className="hover:underline">Staff Portal</Link>
        </nav>
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/staff" element={<div className="p-8"><h1 className="text-2xl font-bold">Staff Portal</h1><p>Restricted access.</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
