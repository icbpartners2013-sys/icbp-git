import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LayoutDashboard, Users, FolderOpen, PieChart, LogOut, Clock, Receipt, FileText, CheckSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const [engagements, setEngagements] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`${API_URL}/audit/api/engagements/`).then(res => setEngagements(res.data)).catch(() => {});
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
          <span className="font-bold text-lg text-white">Staff Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">OVERVIEW</p>
          <Link to="/staff/dashboard" className="flex items-center gap-3 px-3 py-2 bg-icbp-blue-600 text-white rounded-md transition"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/staff/time-tracking" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Clock size={18} /> Time & Expenses</Link>
          <Link to="/staff/workflow" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><CheckSquare size={18} /> Workflow</Link>
          
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">CLIENT SERVICES</p>
          <Link to="/staff/onboarding" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Users size={18} /> Client CRM</Link>
          <Link to="/staff/dms" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><FolderOpen size={18} /> Documents</Link>
          <Link to="/staff/products" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><Receipt size={18} /> Product Catalog</Link>
          
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">FIRM MANAGEMENT</p>
          <Link to="/staff/financials" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><PieChart size={18} /> Financials</Link>
          <Link to="/staff/performance" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md transition"><FileText size={18} /> HR & Payroll</Link>
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
              <p className="text-sm font-bold text-slate-700">Alice Smith</p>
              <p className="text-xs text-slate-500">Senior Audit Manager</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-icbp-blue-100 text-icbp-blue-700 flex items-center justify-center font-bold border border-icbp-blue-200">
              AS
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Billable Hours (Week)</CardDescription>
                <CardTitle className="text-3xl text-icbp-blue-600">32.5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                  <div className="bg-icbp-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: 40.0h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Reviews</CardDescription>
                <CardTitle className="text-3xl text-amber-500">14</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><span className="text-red-500 font-bold">↑ 3</span> since yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Engagements</CardDescription>
                <CardTitle className="text-3xl text-slate-700">{engagements.length || 7}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 mt-2">Across 5 unique clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unbilled WIP</CardDescription>
                <CardTitle className="text-3xl text-green-600">$4,250</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 mt-2">Ready to invoice</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Table Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Engagement Pipeline</CardTitle>
                    <CardDescription>Status of your active client files</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wider border-b">
                          <th className="pb-3 font-medium">Client</th>
                          <th className="pb-3 font-medium">Service</th>
                          <th className="pb-3 font-medium">Deadline</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {engagements.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-400">No active engagements found in database.</td></tr>
                        ) : (
                          engagements.map((eng: any) => (
                            <tr key={eng.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                              <td className="py-4 font-medium text-slate-800">Client #{eng.client}</td>
                              <td className="py-4 text-slate-600">{eng.name}</td>
                              <td className="py-4 text-slate-600">{eng.financial_year_end}</td>
                              <td className="py-4"><span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold">{eng.status}</span></td>
                            </tr>
                          ))
                        )}
                        {engagements.length === 0 && (
                          <>
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
                              <td className="py-4 font-medium text-slate-800">Acme Corp Ltd</td>
                              <td className="py-4 text-slate-600">Statutory Audit</td>
                              <td className="py-4 text-slate-600">Oct 31, 2026</td>
                              <td className="py-4"><span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold">Fieldwork</span></td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
                              <td className="py-4 font-medium text-slate-800">John Doe (HNWI)</td>
                              <td className="py-4 text-slate-600">ITR12 Tax Return</td>
                              <td className="py-4 text-slate-600">Nov 15, 2026</td>
                              <td className="py-4"><span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">Review</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition">
                              <td className="py-4 font-medium text-slate-800">StartUp Tech</td>
                              <td className="py-4 text-slate-600">Monthly Payroll</td>
                              <td className="py-4 text-slate-600">Oct 25, 2026</td>
                              <td className="py-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">Completed</span></td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <Card className="bg-slate-900 text-white border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-icbp-blue-600 hover:bg-icbp-blue-500 border-none text-white"><Clock size={16} className="mr-2" /> Log Time</Button>
                  <Button variant="secondary" className="w-full justify-start text-slate-900 bg-white hover:bg-slate-100 border-none"><Receipt size={16} className="mr-2" /> Submit Expense</Button>
                  <Button variant="secondary" className="w-full justify-start text-slate-900 bg-white hover:bg-slate-100 border-none"><FolderOpen size={16} className="mr-2" /> Upload Working Paper</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Working Papers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded"><FileText size={16} className="text-icbp-blue-600"/></div>
                      <div>
                        <p className="font-medium text-slate-800">Bank_Recon_Q3.xlsx</p>
                        <p className="text-xs text-slate-500">Prepared by A. Smith</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded"><FileText size={16} className="text-amber-600"/></div>
                      <div>
                        <p className="font-medium text-slate-800">Trial_Balance_Draft.pdf</p>
                        <p className="text-xs text-red-500 font-medium">Pending Review</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
