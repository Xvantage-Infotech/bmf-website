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




import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const sendOTP = async (rawPhone) => {
  const cleaned = rawPhone.replace(/\D/g, '');
  const phoneNumber = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;

  if (!/^\+91\d{10}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number');
  }

  console.log('📞 Sending OTP to:', phoneNumber);

  try {
    const isLocalhost = typeof window !== 'undefined' && location.hostname === 'localhost';

    if (isLocalhost) {
      // ✅ No recaptcha on emulator
      return await signInWithPhoneNumber(auth, phoneNumber);
    } else {
      // ✅ Production flow with reCAPTCHA
      const verifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      }, auth);
      return await signInWithPhoneNumber(auth, phoneNumber, verifier);
    }
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    throw err;
  }
};
