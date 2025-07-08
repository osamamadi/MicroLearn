// src/app/context/AuthContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Create the authentication context

const AuthContext = createContext(null);
// Provide the context to the app

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Load user data from localStorage when the app starts

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);
  // Login function – sets user and saves to localStorage

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  // Logout function – clears user and redirects to login page

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };
  // Provide the auth-related values and functions to all children components

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isLoggedIn: !!user, // true if user is not null, false otherwise
        username: user ? user.username : null, // Pass username directly
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
