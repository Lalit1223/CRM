// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the auth context
const AuthContext = createContext(null);

// Base URL for API calls
const API_BASE_URL = "https://pixe-backend-tkrb.onrender.com";

// Create API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to set up localStorage values for chat compatibility
const setupChatCompatibility = (userData, token) => {
  // Ensure token is available for chat component
  localStorage.setItem("token", token);
  localStorage.setItem("adminToken", token); // For admin functions

  if (userData) {
    // Set user name for chat - try different name formats
    const fullName =
      userData.name ||
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      userData.business_name ||
      userData.email_id ||
      "Admin User";

    // Set all possible name variations for maximum compatibility
    localStorage.setItem("agentName", fullName);
    localStorage.setItem("adminName", fullName);
    localStorage.setItem("userName", fullName);
    localStorage.setItem("name", fullName);

    // Set user IDs for API calls
    if (userData._id || userData.id) {
      const userId = userData._id || userData.id;
      localStorage.setItem("agentId", userId);
      localStorage.setItem("adminId", userId);
      localStorage.setItem("userId", userId);
    }

    // Set email
    if (userData.email_id || userData.email) {
      localStorage.setItem("userEmail", userData.email_id || userData.email);
    }

    // Set additional chat-related values
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", userData.role || "admin");

    // //  console.log("Chat compatibility setup completed:", {
    //     name: fullName,
    //     userId: userData._id || userData.id,
    //     email: userData.email_id || userData.email,
    //   });
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (token && isLoggedIn) {
        try {
          // Get user profile
          const response = await api.get("/api/admin/profile");

          if (response.data.success) {
            const userData = response.data.data.admin;
            setUser(userData);
            setIsAuthenticated(true);

            // Set up chat compatibility
            setupChatCompatibility(userData, token);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);

          // If profile fetch fails but we have a token, still consider authenticated
          // This handles cases where the profile endpoint might have issues
          setIsAuthenticated(true);

          // Set up basic chat compatibility with token only
          setupChatCompatibility(
            {
              name: "Admin User",
              _id: localStorage.getItem("adminId") || "admin-user",
              email_id:
                localStorage.getItem("userEmail") || "admin@example.com",
            },
            token
          );
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await api.post("/api/admin/login", credentials);

      if (response.data.success) {
        const { token, admin } = response.data.data;

        // Store authentication data
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("adminId", admin._id);

        // Save remember me if checked
        if (credentials.rememberMe) {
          localStorage.setItem("userEmail", credentials.email_id);
          localStorage.setItem("isRemembered", "true");
        }

        setUser(admin);
        setIsAuthenticated(true);

        // Set up chat compatibility
        setupChatCompatibility(admin, token);

        setLoading(false);

        return { success: true, data: response.data.data };
      } else {
        setLoading(false);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during login. Please try again.",
      };
    }
  };

  // Logout function
  const handleLogout = async () => {
    setLoading(true);

    try {
      if (isAuthenticated) {
        await api.post("/api/admin/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all authentication and chat-related storage
      const keysToRemove = [
        "token",
        "adminToken",
        "agentToken",
        "isLoggedIn",
        "adminId",
        "agentId",
        "userId",
        "agentName",
        "adminName",
        "userName",
        "name",
        "userRole",
      ];

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Keep remember me setting if enabled
      if (localStorage.getItem("isRemembered") !== "true") {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("isRemembered");
      }

      // Update state
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);

      // Add login mode class
      document.body.classList.add("login-mode");
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
