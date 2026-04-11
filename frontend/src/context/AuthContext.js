import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Use environment variable or default to local development server
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (section, data) => {
    try {
      const response = await axios.put(`${API_URL}/profile/update`, {
        section,
        data,
      });
      if (user) {
        setUser({ ...user, profile: response.data.profile });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Update failed",
      };
    }
  };

  const uploadDocument = async (formData, documentType) => {
    try {
      const response = await axios.post(`${API_URL}/profile/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Upload failed",
      };
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Fetch failed",
      };
    }
  };

  const deleteDocument = async (documentType) => {
    try {
      // Get the current document path from the documents state
      const profileResult = await fetchProfile();
      if (profileResult.success) {
        const filePath = profileResult.data.documents?.[documentType];
        const response = await axios.delete(`${API_URL}/profile/document/${documentType}`, {
          data: { filePath }
        });
        return { success: true, data: response.data };
      }
      return { success: false, error: "Could not fetch profile" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Delete failed",
      };
    }
  };

  // Google Sign-In
  const googleSignIn = async (googleUser) => {
    try {
      const profile = googleUser.getBasicProfile();
      const response = await axios.post(`${API_URL}/auth/google-auth`, {
        email: profile.getEmail(),
        googleId: profile.getId(),
        name: profile.getName(),
        picture: profile.getImageUrl(),
      });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Google sign-in failed",
      };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Forgot password failed",
      };
    }
  };

  // Reset Password
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Reset password failed",
      };
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = async () => {
    try {
      const response = await axios.put(`${API_URL}/profile/update`, {
        data: { uiPreferences: { darkMode: !user?.uiPreferences?.darkMode } }
      });
      if (user) {
        setUser({
          ...user,
          uiPreferences: { darkMode: !user.uiPreferences?.darkMode }
        });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Toggle dark mode failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        uploadDocument,
        fetchProfile,
        deleteDocument,
        googleSignIn,
        forgotPassword,
        resetPassword,
        toggleDarkMode,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};