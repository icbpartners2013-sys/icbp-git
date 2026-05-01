import { Button, Badge, Progress } from 'flowbite-react';
import {
  Calculator, Receipt, Lock, BellRing, BookOpen, Building,
  Users, TrendingUp, Star, Search, Shield, Globe, Briefcase,
  ArrowRight, Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ────────────────────────────────────────────────────────────────────
function decodeToken() {
  const t = localStorage.getItem('access_token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
}

// ─── Package catalog ──────────────────────────────────────────────────────────
type PackageStatus = 'active' | 'pending' | 'upgrade';
type ColorKey = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'purple' | 'slate';

interface ServicePackage {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: ColorKey;
  route: string;
  status: PackageStatus;
  badge?: string;
}

const colorMap: Record<ColorKey, { bg: string; icon: string; border: string; badge: string }> = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-t-blue-500',    badge: 'bg-blue-100 text-blue-700' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-t-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  border: 'border-t-violet-500',  badge: 'bg-violet-100 text-violet-700' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-t-amber-500',   badge: 'bg-amber-100 text-amber-700' },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    border: 'border-t-rose-500',    badge: 'bg-rose-100 text-rose-700' },
  cyan:    { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    border: 'border-t-cyan-500',    badge: 'bg-cyan-100 text-cyan-700' },
  purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-t-purple-500',  badge: 'bg-purple-100 text-purple-700' },
  slate:   { bg: 'bg-slate-100',  icon: 'text-slate-600',   border: 'border-t-slate-400',   badge: 'bg-slate-100 text-slate-700' },
};

const ALL_CATALOG: Record<string, Omit<ServicePackage, 'status'>> = {
  // Personal
  'income-tax':      { id: 'income-tax',       label: 'Income Tax',          description: 'ITR12 filing & provisional payments',  icon: Calculator, color: 'blue',    route: '/client/personal/income-tax' },
  'provisional-tax': { id: 'provisional-tax',  label: 'Provisional Tax',     description: 'IRP6 estimates & submissions',          icon: Receipt,    color: 'emerald', route: '/client/personal/provisional-tax' },
  'wealth-estate':   { id: 'wealth-estate',     label: 'Wealth & Estate',     description: 'Trust setup & estate planning',         icon: TrendingUp, color: 'violet',  route: '/client/personal/wealth-estate' },
  'retirement':      { id: 'retirement',        label: 'Retirement Planning', description: 'RA, pension & annuity structuring',     icon: Star,       color: 'amber',   route: '/client/personal/retirement' },
  'expat-tax':       { id: 'expat-tax',         label: 'Expat Tax',           description: 'Foreign employment & treaty relief',    icon: Globe,      color: 'cyan',    route: '/client/personal/expat-tax' },
  'trust-admin':     { id: 'trust-admin',       label: 'Trust Administration',description: 'Inter vivos & testamentary trusts',     icon: Briefcase,  color: 'purple',  route: '/client/personal/trust-admin' },
  // Business
  'bookkeeping':     { id: 'bookkeeping',       label: 'Bookkeeping',         description: 'Monthly management accounts',           icon: BookOpen,   color: 'blue',    route: '/client/business/bookkeeping' },
  'corporate-tax':   { id: 'corporate-tax',     label: 'Corporate Tax',       description: 'ITR14 & provisional tax submissions',   icon: Calculator, color: 'emerald', route: '/client/business/corporate-tax' },
  'vat':             { id: 'vat',               label: 'VAT Returns',         description: 'VAT201 submissions & reconciliation',   icon: Receipt,    color: 'cyan',    route: '/client/business/vat-gst' },
  'payroll':         { id: 'payroll',           label: 'Payroll',             description: 'Monthly payroll & EMP201/501',          icon: Users,      color: 'rose',    route: '/client/business/payroll' },
  'company-sec':     { id: 'company-sec',       label: 'Company Secretarial', description: 'CIPC filings & compliance',             icon: Building,   color: 'purple',  route: '/client/business/company-secretarial' },
  'audit':           { id: 'audit',             label: 'Statutory Audit',     description: 'Annual independent external audit',     icon: Search,     color: 'slate',   route: '/client/business/audit' },
  'bbbee':           { id: 'bbbee',             label: 'B-BBEE',              description: 'Rating, verification & certificates',   icon: Shield,     color: 'amber',   route: '/client/business/bbbee' },
  // Shared
  'vault':           { id: 'vault',             label: 'Document Vault',      description: 'Secure cloud document storage',         icon: Lock,       color: 'slate',   route: '/client/documents' },
};

// Standard packages by client type — active by default
const STANDARD: Record<string, string[]> = {
  PERSONAL:           ['income-tax', 'provisional-tax', 'vault'],
  PERSONAL_HNWI:      ['income-tax', 'provisional-tax', 'wealth-estate', 'retirement', 'vault'],
  BUSINESS:           ['bookkeeping', 'corporate-tax', 'vat', 'company-sec', 'vault'],
  BUSINESS_Startup:   ['company-sec', 'bookkeeping', 'vat', 'vault'],
};

// Suggested upgrades per profile
const UPGRADES: Record<string, string[]> = {
  PERSONAL:           ['wealth-estate', 'retirement', 'trust-admin'],
  PERSONAL_HNWI:      ['expat-tax', 'bookkeeping', 'corporate-tax'],
  BUSINESS:           ['payroll', 'audit', 'bbbee'],
  BUSINESS_Startup:   ['payroll', 'bbbee', 'audit'],
};

// Demo extra packages per username (simulate "signed up for more")
const DEMO_EXTRAS: Record<string, string[]> = {
  'sarah.johnson@demo.co.za': ['bookkeeping', 'corporate-tax', 'payroll'],
  'acme@demo.co.za':          ['payroll', 'bbbee'],
};

function getProfileKey(cType: string, cSubtype: string): string {
  const sub = cSubtype || '';
  if (cType === 'PERSONAL' && sub === 'HNWI') return 'PERSONAL_HNWI';
  if (cType === 'BUSINESS' && sub === 'Startup') return 'BUSINESS_Startup';
  return cType || 'PERSONAL';
}

function buildPackages(cType: string, cSubtype: string, username: string): ServicePackage[] {
  const key = getProfileKey(cType, cSubtype);
  const standard = STANDARD[key] || STANDARD['PERSONAL'];
  const extras = DEMO_EXTRAS[username] || [];
  const upgrades = (UPGRADES[key] || []).filter(u => !standard.includes(u) && !extras.includes(u));

  const active: ServicePackage[] = [...new Set([...standard, ...extras])].map(id => ({
    ...ALL_CATALOG[id],
    status: 'active' as PackageStatus,
    badge: id.includes('tax') ? 'Due Nov 15' : id === 'vat' ? 'Due Oct 25' : undefined,
  }));

  const upgradeCards: ServicePackage[] = upgrades.slice(0, 3).map(id => ({
    ...ALL_CATALOG[id],
    status: 'upgrade' as PackageStatus,
  }));

  return [...active, ...upgradeCards];
}

// ─── Service card component ───────────────────────────────────────────────────
function ServiceCard({ pkg }: { pkg: ServicePackage }) {
  const navigate = useNavigate();
  const c = colorMap[pkg.color];
  const isUpgrade = pkg.status === 'upgrade';

  if (isUpgrade) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col hover:border-blue-300 hover:shadow-sm transition-all duration-200 opacity-75 hover:opacity-100">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gray-100 text-gray-400`}>
            <pkg.icon size={20} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Add Service
          </span>
        </div>
        <h5 className="text-sm font-bold text-gray-700 mt-1">{pkg.label}</h5>
        <p className="text-xs text-gray-400 mt-1 flex-1">{pkg.description}</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Plus size={13} /> Learn More
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border-t-4 ${c.border} rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.bg} ${c.icon}`}>
          <pkg.icon size={20} />
        </div>
        {pkg.badge && (
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badge}`}>
            {pkg.badge}
          </span>
        )}
        {!pkg.badge && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            Active
          </span>
        )}
      </div>
      <h5 className="text-sm font-bold text-gray-900 mt-1">{pkg.label}</h5>
      <p className="text-xs text-gray-500 mt-1 flex-1">{pkg.description}</p>
      <button
        onClick={() => navigate(pkg.route)}
        className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${c.icon} hover:opacity-75 transition-opacity`}
      >
        Open <ArrowRight size={12} />
      </button>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const payload  = decodeToken();
  const username = payload?.username ?? payload?.sub ?? '';
  const cType    = payload?.client_type    || 'PERSONAL';
  const cSubtype = payload?.client_subtype || '';

  const packages = buildPackages(cType, cSubtype, username);
  const active  = packages.filter(p => p.status === 'active');
  const upgrade = packages.filter(p => p.status === 'upgrade');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-8 py-8 max-w-screen-2xl mx-auto">

        {/* Active service packages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Your Services</h2>
            <Badge color="blue" className="font-semibold">{active.length} Active</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {active.map(pkg => <ServiceCard key={pkg.id} pkg={pkg} />)}
          </div>
        </div>

        {/* Suggested upgrades */}
        {upgrade.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Recommended Add-ons</h2>
              <button
                onClick={() => window.location.href = '/shop'}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upgrade.map(pkg => <ServiceCard key={pkg.id} pkg={pkg} />)}
            </div>
          </div>
        )}

        {/* Action required */}
        <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center
          justify-between gap-4 mb-8 shadow-lg shadow-slate-900/20">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BellRing className="text-amber-400" size={20} /> Action Required
            </h3>
            <p className="text-slate-400 mt-1 text-sm">
              You have 2 documents pending your electronic signature.
            </p>
          </div>
          <Button color="light" size="sm" className="shrink-0 font-semibold">Review Now</Button>
        </div>

        {/* Compliance overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="font-bold text-gray-800 text-base mb-5">Compliance Overview</h2>
          <div className="space-y-5">
            {[
              { label: 'Tax Compliance',       value: 80  },
              { label: 'Document Submissions', value: 60  },
              { label: 'CIPC Annual Returns',  value: 100 },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{value}%</span>
                </div>
                <Progress progress={value} color={value === 100 ? 'green' : value >= 70 ? 'blue' : 'yellow'} size="md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
