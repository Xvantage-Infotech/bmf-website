import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, createRecaptchaVerifier, sendOTP, verifyOTP, signInWithEmailPassword, signUpWithEmailAndPassword } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ConfirmationResult, User as FirebaseUser } from 'firebase/auth';

interface ProfileData {
  name?: string;
  email?: string;
  date_of_birth?: string;
  phone_number?: string;
  country?: string;
  state?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  profile_image?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  confirmationResult: ConfirmationResult | null;
  sendOtpToPhone: (phoneNumber: string) => Promise<void>;
  verifyOtpAndLogin: (otp: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: ProfileData & { email?: string, password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<ProfileData | null>;
  updateProfile: (data: ProfileData) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const sendOtpToPhone = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use a dummy div for recaptcha if not already present
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
      }
      const appVerifier = createRecaptchaVerifier('recaptcha-container');
      const result = await sendOTP(phoneNumber, appVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndLogin = async (otp: string) => {
    if (!confirmationResult) {
      setError('No confirmation result available. Please resend OTP.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await verifyOTP(confirmationResult, otp);
      setUser(firebaseUser);
      setConfirmationResult(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await signInWithEmailPassword(email, password);
      setUser(firebaseUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: ProfileData & { email?: string, password?: string }) => {
    setLoading(true);
    setError(null);
    try {
      let firebaseUser: FirebaseUser | null = null;
      if (data.email && data.password) {
        firebaseUser = await signUpWithEmailAndPassword(data.email, data.password);
      } else if (user) {
        firebaseUser = user; // If already logged in via phone, use existing user
      } else {
        throw new Error('Email and password or an existing phone login is required for signup.');
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        const { email, password, ...profileData } = data;
        await setDoc(doc(db, 'users', firebaseUser.uid), profileData, { merge: true });
      }
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (): Promise<ProfileData | null> => {
    if (!user) return null;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as ProfileData) : null;
  };

  const updateProfile = async (data: ProfileData) => {
    if (!user) throw new Error('No user');
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, data, { merge: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      confirmationResult,
      sendOtpToPhone,
      verifyOtpAndLogin,
      login,
      signup,
      logout,
      getProfile,
      updateProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};