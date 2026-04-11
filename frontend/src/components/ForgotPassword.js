import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage("Password reset link has been sent to your email address.");
      setEmail("");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ICBP</h1>
          <p>Reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {!message && (
            <>
              <p className="auth-description">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </>
          )}

          <div className="auth-footer">
            <p>
              Remember your password?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onBackToLogin}
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;