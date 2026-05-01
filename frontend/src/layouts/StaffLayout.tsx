import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import {
  LayoutDashboard, Clock, Users, Wrench, BarChart2,
  ChevronDown, Menu, X, LogOut,
} from 'lucide-react';

// ─── Animated collapsible container ────────────────────────────────────────────
function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="pt-1 pb-2 space-y-0.5">{children}</div>
      </div>
    </div>
  );
}

// ─── Single nav link ────────────────────────────────────────────────────────────
function SideLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center pl-8 pr-3 py-1.5 rounded-md text-[13px] transition-all duration-150 ${
          isActive
            ? 'bg-violet-600 text-white font-medium shadow-[0_2px_8px_rgba(124,58,237,0.45)]'
            : 'text-white/65 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

// ─── Collapsible group ──────────────────────────────────────────────────────────
function NavGroup({
  label,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium
          text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150 group"
      >
        <span className="flex items-center gap-2.5">
          <Icon size={15} className="text-white/40 group-hover:text-violet-400 transition-colors duration-150" />
          {label}
        </span>
        <ChevronDown
          size={13}
          className={`text-white/25 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <Collapsible open={open}>{children}</Collapsible>
    </div>
  );
}

// ─── Section label ──────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-white/30 select-none">
      {text}
    </div>
  );
}

// ─── Sidebar nav content ────────────────────────────────────────────────────────
function StaffSidebar({ onNav }: { onNav?: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo — same height (60px) as DashboardHeader */}
      <a href="/"
        className="flex items-center h-[60px] px-4 border-b border-white/10 shrink-0 hover:bg-white/5 transition-colors">
        <img
          src="/logo-dark.jpg"
          className="h-8 rounded object-contain"
          alt="ICBP"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=7c3aed&color=fff&size=64';
          }}
        />
      </a>

      {/* Brand label */}
      <div className="px-4 pt-3 pb-2.5 border-b border-white/10">
        <h2 className="text-[14px] font-semibold text-white leading-tight tracking-tight">Staff Admin</h2>
        <p className="text-[11px] text-white/40 mt-[2px] font-normal">ICBP Practice Management</p>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-dark px-2 py-3 space-y-0.5" onClick={onNav}>

        {/* Dashboard */}
        <SectionLabel text="Overview" />
        <NavLink
          to="/staff/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
              isActive
                ? 'bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.45)]'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <LayoutDashboard size={15} className="shrink-0" />
          Dashboard
        </NavLink>

        {/* Practice */}
        <SectionLabel text="Practice" />

        <NavGroup label="Practice Management" icon={Clock}>
          <SideLink to="/staff/time-tracking" label="Time Tracking" />
          <SideLink to="/staff/expenses" label="Expenses" />
          <SideLink to="/staff/wip" label="WIP" />
          <SideLink to="/staff/write-offs" label="Write-offs" />
          <SideLink to="/staff/budget" label="Budget" />
          <SideLink to="/staff/review-queue" label="Review Queue" />
          <SideLink to="/staff/workflow" label="Workflow" />
          <SideLink to="/staff/utilization" label="Utilization" />
          <SideLink to="/staff/aged-receivables" label="Aged Receivables" />
        </NavGroup>

        <NavGroup label="Client & Engagements" icon={BarChart2}>
          <SideLink to="/staff/financials" label="Financials" />
          <SideLink to="/staff/project-oversight" label="Project Oversight" />
          <SideLink to="/staff/provisioning" label="Provisioning" />
          <SideLink to="/staff/resource-allocation" label="Resource Allocation" />
          <SideLink to="/staff/strategic-planning" label="Strategic Planning" />
        </NavGroup>

        {/* HR */}
        <SectionLabel text="HR & People" />

        <NavGroup label="HR & People" icon={Users}>
          <SideLink to="/staff/directory" label="Directory" />
          <SideLink to="/staff/leave" label="Leave" />
          <SideLink to="/staff/performance" label="Performance" />
          <SideLink to="/staff/onboarding" label="Onboarding" />
          <SideLink to="/staff/applicant-tracking" label="Applicant Tracking" />
          <SideLink to="/staff/cpe" label="CPE Training" />
          <SideLink to="/staff/payroll-processing" label="Payroll Processing" />
        </NavGroup>

        {/* Tools */}
        <SectionLabel text="Tools" />

        <NavGroup label="Tools & Systems" icon={Wrench}>
          <SideLink to="/staff/dms" label="Document Management" />
          <SideLink to="/staff/communications" label="Communications" />
          <SideLink to="/staff/e-signatures" label="E-Signatures" />
          <SideLink to="/staff/knowledge-base" label="Knowledge Base" />
          <SideLink to="/staff/software-integration" label="Software Integration" />
          <SideLink to="/staff/analytics" label="Analytics" />
          <SideLink to="/staff/security-logs" label="Security Logs" />
          <SideLink to="/staff/products" label="Products Management" />
        </NavGroup>
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-white/50
            hover:bg-red-700/30 hover:text-red-300 transition-all duration-150"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
function decodeToken() {
  const t = localStorage.getItem('access_token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
}

const STAFF_PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard Overview',
  'time-tracking': 'Time Tracking', expenses: 'Expenses', wip: 'WIP',
  'write-offs': 'Write-offs', budget: 'Budget', 'review-queue': 'Review Queue',
  workflow: 'Workflow', utilization: 'Utilization', 'aged-receivables': 'Aged Receivables',
  financials: 'Financials', 'project-oversight': 'Project Oversight',
  provisioning: 'Provisioning', 'resource-allocation': 'Resource Allocation',
  'strategic-planning': 'Strategic Planning',
  directory: 'Directory', leave: 'Leave', performance: 'Performance',
  onboarding: 'Onboarding', 'applicant-tracking': 'Applicant Tracking',
  cpe: 'CPE Training', 'payroll-processing': 'Payroll Processing',
  dms: 'Document Management', communications: 'Communications',
  'e-signatures': 'E-Signatures', 'knowledge-base': 'Knowledge Base',
  'software-integration': 'Software Integration', analytics: 'Analytics',
  'security-logs': 'Security Logs', products: 'Products Management',
};

function getStaffPageTitle(pathname: string): string {
  const last = pathname.split('/').filter(Boolean).pop() || '';
  return STAFF_PAGE_TITLES[last] || last.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ') || 'Admin';
}

// ─── Layout wrapper ─────────────────────────────────────────────────────────────
export default function StaffLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const payload   = decodeToken();
  const firstName    = payload?.first_name || '';
  const lastName     = payload?.last_name  || '';
  const username     = payload?.username   || payload?.sub || '';
  const displayName  = firstName && lastName ? `${firstName} ${lastName}` : username;
  const role         = payload?.staff_title || payload?.role || 'Staff';
  const pageTitle    = getStaffPageTitle(location.pathname);

  return (
    <div className="flex relative">
      {/* Mobile FAB */}
      <button
        onClick={() => setMobileSidebarOpen(o => !o)}
        className="md:hidden fixed bottom-5 left-5 z-50 bg-violet-600 text-white p-3 rounded-full
          shadow-lg shadow-violet-900/50 hover:bg-violet-500 transition-colors duration-150"
        aria-label="Toggle navigation"
      >
        {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar — bg-icbp-dark matches homepage navbar */}
      <aside
        className={`
          fixed md:sticky top-0 z-40 md:z-auto
          w-64 shrink-0 bg-icbp-dark
          h-screen overflow-y-auto
          border-r border-white/10
          shadow-xl shadow-black/30
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile-only header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm font-bold text-white">Staff Admin</span>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="hidden md:flex h-full flex-col">
          <StaffSidebar />
        </div>
        <div className="md:hidden flex flex-col h-[calc(100%-49px)]">
          <StaffSidebar onNav={() => setMobileSidebarOpen(false)} />
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 min-h-screen bg-slate-50">
        <DashboardHeader title={pageTitle} name={displayName} role={role} avatarColor="bg-violet-800" />
        <Outlet />
      </div>
    </div>
  );
}
