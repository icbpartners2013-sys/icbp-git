import { useEffect, useState } from 'react';
import { Card, Button, Badge, Progress, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Clock, Receipt, TrendingUp, TrendingDown, Users, Briefcase, FileText } from 'lucide-react';
import axios from 'axios';

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, valueColor = 'text-blue-600', progress, trend, trendUp }: {
  title: string; value: string; subtitle?: string; valueColor?: string;
  progress?: number; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
      <p className={`text-4xl font-bold ${valueColor} leading-none`}>{value}</p>
      {progress !== undefined && (
        <div className="mt-3">
          <Progress progress={progress} color="blue" size="sm" />
          <p className="text-xs text-gray-400 mt-1">Target: 40.0h</p>
        </div>
      )}
      {trend && (
        <p className={`text-xs flex items-center gap-1 mt-2 font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </p>
      )}
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}

// ─── Engagements table ─────────────────────────────────────────────────────────
function EngagementsTable() {
  const [engagements, setEngagements] = useState<any[]>([]);
  useEffect(() => { axios.get('/api/audit/engagements/').then(r => setEngagements(r.data)).catch(() => {}); }, []);

  const rows = engagements.length > 0 ? engagements : [
    { id: 1, client_name: 'Acme Corp Ltd',   service_type: 'Statutory Audit',  deadline: 'Oct 31, 2026', status: 'Fieldwork' },
    { id: 2, client_name: 'John Doe (HNWI)', service_type: 'ITR12 Tax Return', deadline: 'Nov 15, 2026', status: 'Review' },
    { id: 3, client_name: 'StartUp Tech',     service_type: 'Monthly Payroll',  deadline: 'Oct 25, 2026', status: 'Completed' },
  ];
  const statusColor: Record<string, string> = { Fieldwork: 'warning', Review: 'info', Preparation: 'purple', Completed: 'success' };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h5 className="text-base font-bold text-gray-900">Engagement Pipeline</h5>
          <p className="text-xs text-gray-400 mt-0.5">Status of your active client files</p>
        </div>
        <Button color="light" size="xs" className="font-semibold">View All</Button>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Client</TableHeadCell>
            <TableHeadCell className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Service</TableHeadCell>
            <TableHeadCell className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Deadline</TableHeadCell>
            <TableHeadCell className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-50">
            {rows.map((row: any) => (
              <TableRow key={row.id} className="bg-white hover:bg-slate-50 transition-colors">
                <TableCell className="font-bold text-gray-900 py-4">{row.client_name}</TableCell>
                <TableCell className="text-gray-600">{row.service_type}</TableCell>
                <TableCell className="text-gray-600">{row.deadline}</TableCell>
                <TableCell><Badge color={statusColor[row.status] || 'gray'} className="font-medium">{row.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Billable Hours (Week)" value="32.5" progress={82} valueColor="text-blue-600" />
          <StatCard title="Pending Reviews" value="14" trend="↑ 3 since yesterday" trendUp valueColor="text-amber-500" />
          <StatCard title="Active Engagements" value="7" subtitle="Across 5 unique clients" valueColor="text-gray-800" />
          <StatCard title="Unbilled WIP" value="R4,250" subtitle="Ready to invoice" valueColor="text-emerald-600" />
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><EngagementsTable /></div>

          <div className="flex flex-col gap-5">
            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg shadow-slate-900/20">
              <h5 className="text-base font-bold text-white mb-4">Quick Actions</h5>
              <div className="flex flex-col gap-2.5">
                <Button color="blue" className="w-full font-semibold justify-start" size="sm">
                  <Clock className="mr-2 h-4 w-4" /> Log Time
                </Button>
                <Button color="light" className="w-full font-semibold justify-start" size="sm">
                  <Receipt className="mr-2 h-4 w-4" /> Submit Expense
                </Button>
                <Button color="light" className="w-full font-semibold justify-start" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Upload Working Paper
                </Button>
              </div>
            </div>

            {/* Recent Working Papers */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <h5 className="text-base font-bold text-gray-900 mb-4">Recent Working Papers</h5>
              <div className="space-y-4">
                {[
                  { title: 'Bank_Recon_Q3.xlsx',  by: 'A. Smith', ago: '2h ago',    icon: FileText  },
                  { title: 'Client Proposal.docx', by: 'B. Jones', ago: '4h ago',    icon: Briefcase },
                  { title: 'Staff Meeting Notes',  by: 'C. Lee',   ago: 'Yesterday', icon: Users     },
                ].map(({ title, by, ago, icon: Icon }) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
                      <p className="text-xs text-gray-400">Prepared by {by} &middot; {ago}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
