// // lib/firebase.js
// import { auth } from './firebaseConfig';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// export const createRecaptchaVerifier = () => {
//   if (typeof window === 'undefined') return null;

//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//       size: 'invisible',
//       callback: (response) => {
//         console.log('✅ reCAPTCHA solved:', response);
//       },
//       'expired-callback': () => {
//         console.warn('⚠️ reCAPTCHA expired. Please try again.');
//       },
//     });
//     window.recaptchaVerifier.render();
//   }

//   return window.recaptchaVerifier;
// };

// export const sendOTP = async (phone) => {
//   const verifier = window.recaptchaVerifier;
//   if (!verifier) throw new Error('reCAPTCHA not initialized');

//   return await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
// };



import { signInWithPhoneNumber } from 'firebase/auth';
import { getFirebaseAuth } from './firebaseConfig';

export const sendOTP = async (phoneNumber, verifier) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const full = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
  if (!/^\+91\d{10}$/.test(full)) throw new Error('Invalid phone number');

  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase auth not available');

  try {
    console.log('📞 Using phone:', full);
    console.log('🪟 Verifier valid:', !!verifier);
    await verifier.verify();
    return await signInWithPhoneNumber(auth, full, verifier);
  } catch (err) {
    console.error('❌ Error sending OTP:', err.code, err.message, err);
    throw err;
  }
};

