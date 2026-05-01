import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, Building2, Building, Folder,
  ChevronDown, Menu, X, LogOut,
} from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';

// ─── Helpers ────────────────────────────────────────────────────────────────────
function decodeToken() {
  const t = localStorage.getItem('access_token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
}

function makeAccId(prefix: 'P' | 'B', seed: string): string {
  const key = `icbp_acc_${prefix}_${seed}`;
  const cached = localStorage.getItem(key);
  if (cached) return cached;
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h) ^ seed.charCodeAt(i);
  h = Math.abs(h);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = prefix;
  for (let i = 0; i < 5; i++) { id += chars[h % 32]; h = Math.floor(h / 32); }
  localStorage.setItem(key, id);
  return id;
}

const DEMO_BUSINESSES = [
  { id: 'b1', name: 'Acme Holdings Pty Ltd' },
  { id: 'b2', name: 'Smith Family Trust' },
  { id: 'b3', name: 'Sunrise Ventures CC' },
];

// ─── Nav helpers ──────────────────────────────────────────────────────────────
function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <div className="pt-1 pb-2 space-y-0.5">{children}</div>
      </div>
    </div>
  );
}

function SideLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      `flex items-center pl-8 pr-3 py-1.5 rounded-md text-[13px] transition-all duration-150 ${
        isActive
          ? 'bg-blue-600 text-white font-medium shadow-[0_2px_8px_rgba(37,99,235,0.45)]'
          : 'text-white/65 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
      }`}>
      {label}
    </NavLink>
  );
}

function NavGroup({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium
          text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150 group">
        <span className="flex items-center gap-2.5">
          <Icon size={15} className="text-white/40 group-hover:text-icbp-blue-400 transition-colors duration-150" />
          {label}
        </span>
        <ChevronDown size={13} className={`text-white/25 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <Collapsible open={open}>{children}</Collapsible>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-white/30 select-none">
      {text}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function ClientSidebar({ onNav }: { onNav?: () => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo — same height (60px) as DashboardHeader, matching homepage navbar brand */}
      <a href="/"
        className="flex items-center h-[60px] px-4 border-b border-white/10 shrink-0 hover:bg-white/5 transition-colors">
        <img
          src="/logo-dark.jpg"
          className="h-8 rounded object-contain"
          alt="ICBP"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=1d4ed8&color=fff&size=64';
          }}
        />
      </a>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-dark px-2 py-3 space-y-0.5" onClick={onNav}>
        <SectionLabel text="Overview" />
        <NavLink to="/client/dashboard" end className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
            isActive ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.45)]'
                     : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}>
          <LayoutDashboard size={15} className="shrink-0" /> Dashboard
        </NavLink>

        <SectionLabel text="Services" />
        <NavGroup label="Personal Tax" icon={User}>
          <SideLink to="/client/personal/income-tax" label="Income Tax" />
          <SideLink to="/client/personal/provisional-tax" label="Provisional Tax" />
          <SideLink to="/client/personal/wealth-estate" label="Wealth & Estate" />
          <SideLink to="/client/personal/trust-admin" label="Trust Administration" />
          <SideLink to="/client/personal/expat-tax" label="Expat Tax" />
          <SideLink to="/client/personal/retirement" label="Retirement Planning" />
          <SideLink to="/client/personal/debt-management" label="Debt Management" />
          <SideLink to="/client/personal/deceased-estate" label="Deceased Estate" />
        </NavGroup>

        <NavGroup label="Business Services" icon={Building2}>
          <SideLink to="/client/business/bookkeeping" label="Bookkeeping" />
          <SideLink to="/client/business/audit" label="Audit" />
          <SideLink to="/client/business/independent-review" label="Independent Review" />
          <SideLink to="/client/business/corporate-tax" label="Corporate Tax" />
          <SideLink to="/client/business/vat-gst" label="VAT / GST" />
          <SideLink to="/client/business/payroll" label="Payroll" />
          <SideLink to="/client/business/management-reporting" label="Management Reporting" />
          <SideLink to="/client/business/company-secretarial" label="Company Secretarial" />
          <SideLink to="/client/business/bbbee" label="B-BBEE" />
          <SideLink to="/client/business/business-rescue" label="Business Rescue" />
          <SideLink to="/client/business/coida" label="COIDA" />
        </NavGroup>

        <NavGroup label="CIPC Services" icon={Building}>
          <SideLink to="/client/cipc/registration" label="Company Registration" />
          <SideLink to="/client/cipc/annual-returns" label="Annual Returns" />
          <SideLink to="/client/cipc/name-reservation" label="Name Reservation" />
          <SideLink to="/client/cipc/shelf-company" label="Shelf Company" />
          <SideLink to="/client/cipc/reinstatement" label="Reinstatement" />
          <SideLink to="/client/cipc/deregistration" label="Deregistration" />
          <SideLink to="/client/cipc/director-amendments" label="Director Amendments" />
          <SideLink to="/client/cipc/director-details" label="Director Details" />
          <SideLink to="/client/cipc/officer-changes" label="Officer Changes" />
          <SideLink to="/client/cipc/public-officer" label="Public Officer" />
          <SideLink to="/client/cipc/beneficial-ownership" label="Beneficial Ownership" />
          <SideLink to="/client/cipc/compliance-checklist" label="Compliance Checklist" />
          <SideLink to="/client/cipc/moi-amendments" label="MOI Amendments" />
          <SideLink to="/client/cipc/fas" label="FAS" />
          <SideLink to="/client/cipc/address-changes" label="Address Changes" />
          <SideLink to="/client/cipc/securities-register" label="Securities Register" />
          <SideLink to="/client/cipc/share-certificates" label="Share Certificates" />
          <SideLink to="/client/cipc/share-transfers" label="Share Transfers" />
          <SideLink to="/client/cipc/trademark" label="Trademark" />
          <SideLink to="/client/cipc/patent" label="Patent" />
        </NavGroup>

        <SectionLabel text="My Account" />
        <NavGroup label="Documents & Tools" icon={Folder}>
          <SideLink to="/client/documents" label="Documents" />
          <SideLink to="/client/signatures" label="E-Signatures" />
          <SideLink to="/client/messages" label="Messages" />
          <SideLink to="/client/billing" label="Billing" />
          <SideLink to="/client/reminders" label="Reminders" />
          <SideLink to="/client/mobile-scanner" label="Mobile Scanner" />
          <SideLink to="/client/tasks" label="Tasks" />
        </NavGroup>
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-white/50
            hover:bg-red-700/30 hover:text-red-300 transition-all duration-150">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

// ─── Route → page title ───────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard Overview',
  'income-tax': 'Income Tax', 'provisional-tax': 'Provisional Tax',
  'wealth-estate': 'Wealth & Estate', 'trust-admin': 'Trust Administration',
  'expat-tax': 'Expat Tax', retirement: 'Retirement Planning',
  'debt-management': 'Debt Management', 'deceased-estate': 'Deceased Estate',
  bookkeeping: 'Bookkeeping', audit: 'Audit',
  'independent-review': 'Independent Review', 'corporate-tax': 'Corporate Tax',
  'vat-gst': 'VAT / GST', payroll: 'Payroll',
  'management-reporting': 'Management Reporting', 'company-secretarial': 'Company Secretarial',
  bbbee: 'B-BBEE', 'business-rescue': 'Business Rescue', coida: 'COIDA',
  registration: 'Company Registration', 'annual-returns': 'Annual Returns',
  'name-reservation': 'Name Reservation', 'shelf-company': 'Shelf Company',
  reinstatement: 'Reinstatement', deregistration: 'Deregistration',
  'director-amendments': 'Director Amendments', 'director-details': 'Director Details',
  'officer-changes': 'Officer Changes', 'public-officer': 'Public Officer',
  'beneficial-ownership': 'Beneficial Ownership', 'compliance-checklist': 'Compliance Checklist',
  'moi-amendments': 'MOI Amendments', fas: 'FAS', 'address-changes': 'Address Changes',
  'securities-register': 'Securities Register', 'share-certificates': 'Share Certificates',
  'share-transfers': 'Share Transfers', trademark: 'Trademark', patent: 'Patent',
  documents: 'Documents', signatures: 'E-Signatures', messages: 'Messages',
  billing: 'Billing', reminders: 'Reminders', 'mobile-scanner': 'Mobile Scanner', tasks: 'Tasks',
};

function getPageTitle(pathname: string): string {
  const last = pathname.split('/').filter(Boolean).pop() || '';
  return PAGE_TITLES[last] || last.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ') || 'Portal';
}

// ─── Layout wrapper ───────────────────────────────────────────────────────────
export default function ClientLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedBizIdx, setSelectedBizIdx] = useState(0);
  const location = useLocation();
  const payload  = decodeToken();
  const firstName   = payload?.first_name || '';
  const lastName    = payload?.last_name  || '';
  const username    = payload?.username   || payload?.sub || '';
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : username;
  const role        = payload?.client_subtype || 'Client';
  const personalAccId = makeAccId('P', username);
  const pageTitle   = getPageTitle(location.pathname);

  const businesses = DEMO_BUSINESSES.map(b => ({
    id: b.id, name: b.name, accId: makeAccId('B', b.id + username),
  }));

  return (
    <div className="flex relative">
      {/* Mobile FAB */}
      <button onClick={() => setMobileSidebarOpen(o => !o)}
        className="md:hidden fixed bottom-5 left-5 z-50 bg-blue-600 text-white p-3 rounded-full
          shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors duration-150"
        aria-label="Toggle navigation">
        {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar — bg-icbp-dark matches homepage navbar */}
      <aside className={`
        fixed md:sticky top-0 z-40 md:z-auto
        w-64 shrink-0 bg-icbp-dark h-screen
        border-r border-white/10 shadow-xl shadow-black/30
        transition-transform duration-300 ease-in-out flex flex-col
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile-only close bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <span className="text-sm font-bold text-white">Client Portal</span>
          <button onClick={() => setMobileSidebarOpen(false)} className="text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <ClientSidebar onNav={() => setMobileSidebarOpen(false)} />
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader
          title={pageTitle}
          name={displayName}
          role={role}
          avatarColor="bg-blue-600"
          portalInfo={{
            portalLabel: 'Client Portal',
            personalAccId,
            businesses,
            selectedBizIdx,
            onSelectBiz: setSelectedBizIdx,
          }}
        />
        <div className="flex-1"><Outlet /></div>
      </div>
    </div>
  );
}
