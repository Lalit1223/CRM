// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check local storage for auth token
        const token = localStorage.getItem("auth_token");

        if (token) {
          // In a real app, you would validate the token with your backend
          // const response = await api.validateToken(token);

          // For demo purposes, we'll simulate a user
          const user = {
            id: "1",
            name: "Lalit Gandhi",
            email: "lalit@example.com",
            role: "admin",
            permissions: [
              "chats.view_all",
              "chats.assign",
              "chats.view_customer_identifiers",
            ],
          };

          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        localStorage.removeItem("auth_token");
        setError("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API call
      // const response = await api.login(email, password);

      // Simulated API response
      if (email === "demo@example.com" && password === "password") {
        const response = {
          token: "dummy_auth_token",
          user: {
            id: "1",
            name: "Lalit Gandhi",
            email: "lalit@example.com",
            role: "admin",
            permissions: [
              "chats.view_all",
              "chats.assign",
              "chats.view_customer_identifiers",
            ],
          },
        };

        // Store token in localStorage
        localStorage.setItem("auth_token", response.token);

        setCurrentUser(response.user);
        setIsAuthenticated(true);

        return true;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Failed to log in");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth_token");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions.includes(permission);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Value object to be provided by context
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    hasPermission,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
