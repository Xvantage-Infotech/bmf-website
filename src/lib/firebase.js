// Firebase configuration
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLWllbelIfPj5owYzZBiXAK7gJcCrgLsE",
  authDomain: "book-my-farm-87452.firebaseapp.com",
  projectId: "book-my-farm-87452",
  storageBucket: "book-my-farm-87452.firebasestorage.app",
  messagingSenderId: "40957217895",
  appId: "1:40957217895:web:7c196b5a39d402f8bc58c2",
  measurementId: "G-BM86YHT7T8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Create a reCAPTCHA verifier
export const createRecaptchaVerifier = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      // Ask user to solve reCAPTCHA again
    }
  });
};

// Send OTP
export const sendOTP = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Auth state listener
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Sign up with email/password
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up with email and password:', error);
    throw error;
  }
};

// Sign in with email/password
export const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};
