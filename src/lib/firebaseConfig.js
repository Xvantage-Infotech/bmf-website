// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCLWllbelIfPj5owYzZBiXAK7gJcCrgLsE',
//   authDomain: 'book-my-farm-87452.firebaseapp.com',
//   projectId: 'book-my-farm-87452',
//   storageBucket: 'book-my-farm-87452.appspot.com',
//   messagingSenderId: '40957217895',
//   appId: '1:40957217895:web:7c196b5a39d402f8bc58c2',
// };

// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const auth = typeof window !== 'undefined' ? getAuth(app) : null;
// if (auth) auth.useDeviceLanguage();

// export { auth };

// export const createRecaptchaVerifier = () => {
//   if (typeof window === 'undefined' || !auth) return null;

//   if (!window.recaptchaVerifier) {
//     const container = document.getElementById('recaptcha-container');
//     if (!container) {
//       console.warn('❌ #recaptcha-container not found');
//       return null;
//     }

//     try {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         'recaptcha-container',
//         {
//           size: 'invisible',
//           callback: () => console.log('✅ reCAPTCHA solved'),
//           'expired-callback': () => console.warn('⚠️ reCAPTCHA expired'),
//         },
//         auth
//       );

//       window.recaptchaVerifier.render().then((widgetId) => {
//         console.log('📌 reCAPTCHA widget ID:', widgetId);
//       });
//     } catch (err) {
//       console.error('❌ Failed to create RecaptchaVerifier:', err);
//       return null;
//     }
//   }

//   return window.recaptchaVerifier;
// };

// export const sendOTP = async (phoneNumber) => {
//   if (!window.recaptchaVerifier) {
//     throw new Error('Recaptcha not initialized');
//   }

//   return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
// };

// import { initializeApp, getApps, getApp } from "firebase/app";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCLWllbelIfPj5owYzZBiXAK7gJcCrgLsE",
//   authDomain: "book-my-farm-87452.firebaseapp.com",
//   projectId: "book-my-farm-87452",
//   storageBucket: "book-my-farm-87452.appspot.com",
//   messagingSenderId: "40957217895",
//   appId: "1:40957217895:web:7c196b5a39d402f8bc58c2",
// };

// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// // IMPORTANT: don't export a pre-created `auth` anymore
// let _auth = null;

// /**
//  * Dynamically create/get the auth instance.
//  */
// export const getAuthInstance = () => {
//   if (typeof window === "undefined") return null;
//   if (!_auth) {
//     _auth = getAuth(app);
//     _auth.useDeviceLanguage();
//   }
//   return _auth;
// };

// /**
//  * Create the RecaptchaVerifier (only in the browser).
//  */
// export const createRecaptchaVerifier = () => {
//   if (typeof window === "undefined") {
//     console.warn("Not running in the browser");
//     return null;
//   }

//   const auth = getAuthInstance();
//   if (!auth) {
//     console.error("Auth is not initialized");
//     return null;
//   }

//   if (!window.recaptchaVerifier) {
//     const container = document.getElementById("recaptcha-container");
//     if (!container) {
//       console.warn("❌ #recaptcha-container not found");
//       return null;
//     }

//     try {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         container,
//         {
//           size: "invisible",
//           callback: () => console.log("✅ reCAPTCHA solved"),
//           "expired-callback": () => console.warn("⚠️ reCAPTCHA expired"),
//         },
//         auth
//       );

//       window.recaptchaVerifier.render().then((widgetId) => {
//         console.log("📌 reCAPTCHA widget ID:", widgetId);
//       });
//     } catch (err) {
//       console.error("❌ Failed to create RecaptchaVerifier:", err);
//       return null;
//     }
//   }

//   return window.recaptchaVerifier;
// };

// /**
//  * Send OTP using the recaptcha verifier.
//  */
// export const sendOTP = async (phoneNumber) => {
//   console.log(getAuthInstance());
//   const auth = getAuthInstance();
//   if (!window.recaptchaVerifier) {
//     throw new Error("Recaptcha not initialized");
//   }

//   return await signInWithPhoneNumber(
//     auth,
//     phoneNumber,
//     window.recaptchaVerifier
//   );
// };



import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  connectAuthEmulator
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCLWllbelIfPj5owYzZBiXAK7gJcCrgLsE",
  authDomain: "book-my-farm-87452.firebaseapp.com",
  projectId: "book-my-farm-87452",
  storageBucket: "book-my-farm-87452.appspot.com",
  messagingSenderId: "40957217895",
  appId: "1:40957217895:web:7c196b5a39d402f8bc58c2",
  measurementId: "G-BM86YHT7T8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Configure auth settings
if (typeof window !== 'undefined') {
  // Set language to device language
  auth.useDeviceLanguage();
  
  // Configure reCAPTCHA settings
  auth.settings = {
    appVerificationDisabledForTesting: false
  };
  
  // For development - uncomment if you want to test with emulator
  // if (process.env.NODE_ENV === 'development') {
  //   connectAuthEmulator(auth, "http://localhost:9099");
  // }
}

export {
  app,
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber
};