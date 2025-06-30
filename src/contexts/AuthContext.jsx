"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  createRecaptchaVerifier,
  sendOTP,
  verifyOTP,
  signInWithEmailPassword,
  signUpWithEmailAndPassword
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { api } from '@/axiosApi';
import { registerUserWithPhone } from '@/services/Auth/auth.service';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);
const sendOtpToPhone = async (phoneNumber) => {
  setLoading(true);
  setError(null);
  try {
    // 🔥 Just call your backend API
    const response = await api.post('/api/add_user', {
      phone_number: phoneNumber,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send OTP');
    }

    // No Firebase confirmationResult needed
    setConfirmationResult(true); // Just to mark OTP as sent
  } catch (err) {
    setError(err.message || 'Failed to send OTP');
  } finally {
    setLoading(false);
  }
};

const verifyOtpAndLogin = async (otp, phone) => {
  if (!confirmationResult) {
    setError('Please request an OTP first.');
    return;
  }

  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/api/verify_otp', {
      phone_number: phone,
      otp: otp,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Invalid OTP');
    }

    setUser({ phoneNumber: phone }); // Store basic info if needed
    setConfirmationResult(null);
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'OTP verification failed');
  } finally {
    setLoading(false);
  }
};

const loginWithPhoneOtp = async (phoneNumber) => {
  try {
    const response = await api.post('/api/login', {
      phone_number: phoneNumber,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    // Optionally store token if returned
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    setUser({ phoneNumber }); // Set basic user session
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Login failed');
    throw err;
  }
};


  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await signInWithEmailPassword(email, password);
      setUser(firebaseUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const signup = async (data) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     let firebaseUser = null;
  //     if (data.email && data.password) {
  //       firebaseUser = await signUpWithEmailAndPassword(data.email, data.password);
  //     } else if (user) {
  //       firebaseUser = user;
  //     } else {
  //       throw new Error('Email and password or an existing phone login is required for signup.');
  //     }

  //     if (firebaseUser) {
  //       setUser(firebaseUser);
  //       const { email, password, ...profileData } = data;
  //       await setDoc(doc(db, 'users', firebaseUser.uid), profileData, { merge: true });
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const signup = async (data) => {
  setLoading(true);
  setError(null);

  try {
    const firebaseUser = user;
    if (!firebaseUser) throw new Error('OTP verification failed. Please try again.');

    const phoneNumber = firebaseUser.phoneNumber || data.mobileNumber;
    if (!phoneNumber) throw new Error('Phone number is missing.');

    const result = await registerUserWithPhone(phoneNumber);

    if (result.token) {
      localStorage.setItem('token', result.token);
    } else {
      throw new Error('Token not received from server');
    }

    const { email, password, ...profileData } = data;
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...profileData,
      phoneNumber,
    }, { merge: true });

    setUser(firebaseUser);
  } catch (err) {
    setError(err.message || 'Signup failed');
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    if (!user) return null;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const updateProfile = async (data) => {
    if (!user) throw new Error('No user');
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        confirmationResult,
        sendOtpToPhone,
        verifyOtpAndLogin,
         loginWithPhoneOtp,
        login,
        signup,
        logout,
        getProfile,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
