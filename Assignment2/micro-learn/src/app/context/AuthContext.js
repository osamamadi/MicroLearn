// app/context/AuthContext.js
'use client';

import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to manage and provide authentication state
export function AuthProvider({ children }) {
  // State for login status, initialized to false (no persistence without localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State for username, initialized to empty string (no persistence without localStorage)
  const [username, setUsername] = useState('');

  // Function to handle user login
  const login = (userIdentifier) => {
    setIsLoggedIn(true);
    setUsername(userIdentifier);
  };

  // Function to handle user logout
  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  // The value provided to consumers of this context
  const value = {
    isLoggedIn,
    username,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
