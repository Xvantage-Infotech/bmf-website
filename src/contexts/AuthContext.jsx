"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuthInstance } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuthInstance(); // ✅ get auth instance dynamically
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        confirmationResult,
        setConfirmationResult,
        error,
        setError,
        clearError, // ✅ ADD THIS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
