import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Button, NavbarBrand, NavbarToggle, NavbarCollapse, NavbarLink } from 'flowbite-react';

/** Decode JWT to read user info (no library needed) */
function decodeToken() {
  const t = localStorage.getItem('access_token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
}

export default function MainLayout() {
  const navigate = useNavigate();
  useLocation();
  const token = localStorage.getItem('access_token');
  const payload = token ? decodeToken() : null;

  const firstName   = payload?.first_name || '';
  const lastName    = payload?.last_name  || '';
  const username    = payload?.username   || payload?.sub || '';
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : username;
  const initials    = displayName
    .split(' ').filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-icbp-gray-50 flex flex-col font-sans">
      <Navbar fluid className="bg-icbp-dark text-white border-b border-white/10 shadow-md"
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}>

        <NavbarBrand href="/" className="gap-2">
          <img
            src="/logo-dark.jpg"
            className="h-8 rounded"
            alt="ICBP Logo"
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=1d4ed8&color=fff';
            }}
          />
        </NavbarBrand>

        <div className="flex md:order-2 items-center gap-3">
          {token ? (
            <>
              {/* User info + avatar */}
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-tight">{displayName}</p>
                  <p className="text-[10px] text-white/50 leading-tight">
                    {payload?.role || (payload?.user_type === 'CLIENT' ? 'Client' : 'Staff')}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold
                    flex items-center justify-center ring-2 ring-white/20 cursor-pointer
                    hover:bg-blue-500 transition-colors select-none"
                  title={displayName}
                >
                  {initials}
                </div>
              </div>
              <Button color="failure" size="xs" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button href="/login" className="bg-icbp-blue-600 hover:bg-icbp-blue-500">
              Client Login
            </Button>
          )}
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <NavbarLink href="/" className="text-white md:hover:text-icbp-blue-400">Home</NavbarLink>
          <NavbarLink href="#" className="text-white md:hover:text-icbp-blue-400">About Us</NavbarLink>
          <NavbarLink href="#" className="text-white md:hover:text-icbp-blue-400">Services</NavbarLink>
          <NavbarLink href="/shop" className="text-white md:hover:text-icbp-blue-400">Pricing</NavbarLink>
          <NavbarLink href="/shop" className="text-white md:hover:text-icbp-blue-400">Contact</NavbarLink>

          {token && (
            <>
              <NavbarLink href="/client/dashboard" className="font-bold text-icbp-blue-400 border-t md:border-t-0 mt-2 md:mt-0">
                Client Portal
              </NavbarLink>
              <NavbarLink href="/staff/dashboard" className="font-bold text-purple-400">
                Staff Portal
              </NavbarLink>
            </>
          )}
        </NavbarCollapse>
      </Navbar>

      <main className="flex-1 pb-12">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500 mt-auto">
        <div className="space-x-4 mb-2">
          <a href="#" className="hover:text-gray-800 transition">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-800 transition">Terms of Service</a>
        </div>
        <div>© 2026 International Company Business Partners | Developed by <a href="https://icreatedigital.co.za">iCreate Digital Solutions</a></div>
      </footer>
    </div>
  );
}
