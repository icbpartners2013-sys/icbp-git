import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function StaffDashboard() {
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
        <button className="bg-icbp-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-icbp-blue-700 transition">
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
          <div className="bg-icbp-dark text-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">My Time (This Week)</h2>
            <div className="text-4xl font-light mb-2">32.5 <span className="text-lg text-gray-400">hrs</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-icbp-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
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
