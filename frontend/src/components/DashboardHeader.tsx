import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Portal top-bar — matches the public site's MainLayout navbar.
 * bg-icbp-dark · sticky top-0 · contains logo, portal identity (client), page title, user avatar.
 */

interface Business { id: string; name: string; accId: string; }

interface PortalInfo {
  portalLabel: string;
  personalAccId: string;
  businesses: Business[];
  selectedBizIdx: number;
  onSelectBiz: (idx: number) => void;
}

interface DashboardHeaderProps {
  title: string;
  name: string;
  role: string;
  avatarColor?: string;
  portalInfo?: PortalInfo;
}

export default function DashboardHeader({
  title, name, role, avatarColor = 'bg-blue-600', portalInfo,
}: DashboardHeaderProps) {
  const [showBizMenu, setShowBizMenu] = useState(false);

  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="px-6 h-[60px] flex items-center gap-5 relative">

        {/* ── Logo ─────────────────────────────────────────── */}
        <a href="/" className="shrink-0 flex items-center">
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

        {/* ── Portal identity (client portal only) ─────────── */}
        {portalInfo && (
          <>
            <span className="h-7 w-px bg-gray-200 shrink-0" />

            {/* "Client Portal" group */}
            <div className="flex flex-col justify-center select-none">
              <span className="text-[13px] font-bold text-icbp-blue-600 leading-tight tracking-tight">
                {portalInfo.portalLabel}
              </span>
              <span className="text-[11px] font-normal text-gray-400 leading-tight mt-[1px]">
                Acc: {portalInfo.personalAccId}
              </span>
            </div>

            <span className="h-7 w-px bg-gray-200 shrink-0" />

            {/* Business selector */}
            <div className="relative flex flex-col justify-center select-none">
              <button
                onClick={() => setShowBizMenu(o => !o)}
                className="flex items-center gap-1 text-[13px] font-semibold text-gray-800 hover:text-icbp-blue-600
                  transition-colors duration-150 leading-tight tracking-tight"
              >
                <span className="max-w-[160px] truncate">
                  {portalInfo.businesses[portalInfo.selectedBizIdx]?.name}
                </span>
                <ChevronDown
                  size={12}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${showBizMenu ? 'rotate-180' : ''}`}
                />
              </button>
              <span className="text-[11px] font-normal text-gray-400 leading-tight mt-[1px]">
                Acc: {portalInfo.businesses[portalInfo.selectedBizIdx]?.accId}
              </span>

              {/* Dropdown */}
              {showBizMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowBizMenu(false)} />
                  <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-200
                    rounded-xl py-1 min-w-[220px] shadow-xl shadow-gray-200/80">
                    {portalInfo.businesses.map((biz, i) => (
                      <button
                        key={biz.id}
                        onClick={() => { portalInfo.onSelectBiz(i); setShowBizMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 ${
                          i === portalInfo.selectedBizIdx
                            ? 'text-icbp-blue-600 font-semibold bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block leading-tight">{biz.name}</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">Acc: {biz.accId}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── Page title (absolute centre) ─────────────────── */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-[13px] font-semibold text-gray-500 tracking-tight whitespace-nowrap">
            {title}
          </span>
        </div>

        <div className="flex-1" />

        {/* ── User info ────────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{role}</p>
          </div>
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-white flex items-center justify-center
              text-xs font-bold ring-2 ring-gray-200 select-none shadow-sm`}
          >
            {initials}
          </div>
        </div>

      </div>
    </header>
  );
}
