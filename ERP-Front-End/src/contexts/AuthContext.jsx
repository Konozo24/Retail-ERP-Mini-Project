import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage so the user stays logged in on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // --- Actions ---

  // Login Function
  const login = (userData) => {
    // In a real app, userData comes from your API response
    // e.g., { name: "Admin", token: "abc-123", role: "manager" }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Helper boolean to check if logged in
  const isAuthenticated = !!user;

  // The value object contains everything we want to share with the app
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create and Export the Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};