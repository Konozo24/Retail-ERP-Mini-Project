import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in on initial page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    // Simulating an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock Validation logic
        if (password.length >= 6) { 
          const userData = { email, token: "mock-jwt-token" };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData)); // Save to LS
          resolve(userData);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800); // 800ms simulated delay
    });
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);