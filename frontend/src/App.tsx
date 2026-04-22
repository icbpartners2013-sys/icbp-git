import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Public Pages
import Login from './pages/public/Login';
import Shop from './pages/public/Shop';
import Checkout from './pages/public/Checkout';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import OnboardingForms from './pages/client/OnboardingForms';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  // A simple auth guard wrapper
  const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<RequireAuth><ClientDashboard /></RequireAuth>} />
          
          {/* Public / Semi-Public Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Client Routes */}
          <Route path="/client/dashboard" element={<RequireAuth><ClientDashboard /></RequireAuth>} />
          <Route path="/onboarding/forms" element={<RequireAuth><OnboardingForms /></RequireAuth>} />
          
          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={<RequireAuth><StaffDashboard /></RequireAuth>} />
        </Route>
      </Routes>
    </Router>
  );
}
