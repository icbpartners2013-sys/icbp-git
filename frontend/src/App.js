import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfileDashboard from "./components/ProfileDashboard";
import "./App.css";

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="loading-screen">
        {/* Modern Logo Animation */}
        <div className="loading-logo">
          <div className="loading-logo-square"></div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">Loading</div>

        {/* Progress Bar */}
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>

        {/* Animated Dots */}
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <ProfileDashboard />;
  }

  return showLogin ? (
    <Login onSwitchToRegister={() => setShowLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setShowLogin(true)} />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;