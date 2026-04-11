import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ProfileDashboard from "./components/ProfileDashboard";
import "./App.css";

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState("login"); // "login", "register", "forgot-password"

  if (loading) {
    return (
      <div className="loading-screen">
        {/* Pulse Rings Animation */}
        <div className="pulse-rings">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-center"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <ProfileDashboard />;
  }

  if (currentView === "forgot-password") {
    return <ForgotPassword onBackToLogin={() => setCurrentView("login")} />;
  }

  if (currentView === "register") {
    return <Register onSwitchToLogin={() => setCurrentView("login")} />;
  }

  return (
    <Login
      onSwitchToRegister={() => setCurrentView("register")}
      onForgotPassword={() => setCurrentView("forgot-password")}
    />
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