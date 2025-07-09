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



// import { signInWithPhoneNumber } from 'firebase/auth';
// import { auth } from './firebaseConfig';

// export const sendOTP = async (phoneNumber, verifier) => {
//   try {
//     // Verify verifier is properly initialized
//     if (!verifier || typeof verifier.verify !== 'function') {
//       throw new Error('reCAPTCHA verifier not properly initialized');
//     }

//     const formattedPhone = `+91${phoneNumber.replace(/\D/g, '')}`;
    
//     if (!/^\+91\d{10}$/.test(formattedPhone)) {
//       throw new Error('Invalid phone number format');
//     }

//     console.log('Sending OTP to:', formattedPhone);
//     const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
//     console.log('OTP sent successfully');
//     return confirmation;
    
//   } catch (err) {
//     console.error('Error in sendOTP:', {
//       error: err,
//       message: err.message,
//       stack: err.stack
//     });
//     throw new Error(err.message || 'Failed to send OTP');
//   }
// };




import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const sendOTP = async (phoneNumber) => {
  try {
    const raw = phoneNumber.replace(/\D/g, '');
    const formattedPhone = `+91${raw}`;

    if (!/^\+91\d{10}$/.test(formattedPhone)) {
      throw new Error("Invalid phone number format");
    }

    // 🔥 Create new RecaptchaVerifier
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
      },
      auth
    );

    const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    console.log("✅ OTP sent successfully");
    return confirmation;
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    throw new Error(err?.message || "Failed to send OTP");
  }
};
