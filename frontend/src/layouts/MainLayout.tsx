import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-icbp-gray-50 flex flex-col font-sans">
      <header className="bg-icbp-dark text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <img src="/logo-light.jpg" alt="ICBP Logo" className="h-8 w-auto rounded" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=ICBP&background=1d4ed8&color=fff'; }} />
                <span className="font-bold text-xl tracking-wider text-icbp-blue-400 hidden sm:block">
                  <span className="text-white">ICBP</span> Portal
                </span>
              </div>
              {token && (
                <div className="hidden md:block ml-10">
                  <div className="flex items-baseline space-x-4">
                    <Link to="/client/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Client Area</Link>
                    <Link to="/staff/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Staff Area</Link>
                    <Link to="/shop" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Shop Services</Link>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {token ? (
                <button onClick={handleLogout} className="text-sm font-bold text-red-400 hover:text-red-300">Logout</button>
              ) : (
                <Link to="/login" className="text-sm font-bold text-icbp-blue-400 hover:text-blue-300">Login</Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pb-12">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500 mt-auto">
        <div className="space-x-4 mb-2">
          <a href="#" className="hover:text-gray-800 transition">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-800 transition">Terms of Service</a>
        </div>
        <div>© 2026 International Company Business Partners</div>
      </footer>
    </div>
  );
}
