"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // ✅ use dynamic fetch
import { getUserProfile } from "@/services/Auth/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);



useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    setAuthInitialized(true);
    return;
  }

  const fetchUser = async () => {
    try {
      const res = await getUserProfile(token);
      const fullUser = res?.data;

      setUser({ ...fullUser, token }); // ✅ Update with DB response
    } catch (err) {
      console.error("❌ Failed to fetch user from DB:", err);
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setAuthInitialized(true);
    }
  };

  fetchUser();

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const firebaseToken = await firebaseUser.getIdToken();
      localStorage.setItem("firebaseToken", firebaseToken);

      setUser((prev) => ({
        ...prev,
        firebaseToken,
      }));
    }
  });

  return () => unsubscribe();
}, []);


const updateUser = (updatedData) => {
  setUser((prev) => ({
    ...prev,
    ...updatedData,
  }));
};




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
    const token = await result.user.getIdToken();

    localStorage.setItem("firebaseToken", token);
    setUser((prev) => ({ ...prev, firebaseToken: token }));
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

  
const logout = async () => {
  try {
    await signOut(auth); // ✅ Kill Firebase session
  } catch (err) {
    console.error("Error signing out from Firebase:", err);
  }

  localStorage.removeItem("accessToken");
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
          isAuthenticated: !!user,
        confirmationResult,
        setConfirmationResult,
        error,
        setError,
        clearError,
        authInitialized,
        loading,
        verifyOtpAndLogin,
        signup,
         logout,
         updateUser
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
