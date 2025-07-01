import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCLWllbelIfPj5owYzZBiXAK7gJcCrgLsE',
  authDomain: 'book-my-farm-87452.firebaseapp.com',
  projectId: 'book-my-farm-87452',
  storageBucket: 'book-my-farm-87452.appspot.com',
  messagingSenderId: '40957217895',
  appId: '1:40957217895:web:7c196b5a39d402f8bc58c2',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = typeof window !== 'undefined' ? getAuth(app) : null;
if (auth) auth.useDeviceLanguage();

export { auth };

export const createRecaptchaVerifier = () => {
  if (typeof window === 'undefined' || !auth) return null;

  if (!window.recaptchaVerifier) {
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.warn('❌ #recaptcha-container not found');
      return null;
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => console.log('✅ reCAPTCHA solved'),
          'expired-callback': () => console.warn('⚠️ reCAPTCHA expired'),
        },
        auth
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        console.log('📌 reCAPTCHA widget ID:', widgetId);
      });
    } catch (err) {
      console.error('❌ Failed to create RecaptchaVerifier:', err);
      return null;
    }
  }

  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber) => {
  if (!window.recaptchaVerifier) {
    throw new Error('Recaptcha not initialized');
  }

  return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
};
