import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLWllbelIfPj5owYzZBiXAK7gJcCrgLsE",
  authDomain: "book-my-farm-87452.firebaseapp.com",
  projectId: "book-my-farm-87452",
  storageBucket: "book-my-farm-87452.appspot.com",
  messagingSenderId: "40957217895",
  appId: "1:40957217895:web:7c196b5a39d402f8bc58c2",
  measurementId: "G-BM86YHT7T8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Configure auth settings
if (typeof window !== "undefined") {
  // Set language to device language
  auth.useDeviceLanguage();

  setPersistence(auth, browserLocalPersistence);
}

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber };
