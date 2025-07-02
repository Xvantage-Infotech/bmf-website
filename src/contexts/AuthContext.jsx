"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // ✅ use dynamic fetch

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Monitor login state safely client-side
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Clear auth error
  const clearError = () => setError(null);

  // ✅ OTP verification logic
  const verifyOtpAndLogin = async (otp) => {
    if (!confirmationResult) {
      setError("No OTP confirmation session found");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      setUser(result.user);
      setError(null);
    } catch (err) {
      console.error("❌ OTP verification failed:", err);
      setError("Invalid OTP. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optional: Send user data to backend after signup
  const signup = async ({ name, mobileNumber }) => {
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber }),
      });
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        confirmationResult,
        setConfirmationResult,
        error,
        setError,
        clearError,
        loading,
        verifyOtpAndLogin,
        signup,
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
