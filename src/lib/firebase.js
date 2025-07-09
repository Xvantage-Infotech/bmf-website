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



// import { getAuth, signInWithPhoneNumber } from "firebase/auth";

// // Function to send OTP
// export const sendOTP = async (phoneNumber, verifier) => {
//   try {
//     // Verify verifier is properly initialized
//     if (!verifier || typeof verifier.verify !== 'function') {
//       throw new Error('reCAPTCHA verifier not properly initialized');
//     }

//     // Format phone number (for India: +91)
//     const formattedPhone = `+91${phoneNumber.replace(/\D/g, '')}`;

//     // Validate phone number format
//     if (!/^\+91\d{10}$/.test(formattedPhone)) {
//       throw new Error('Invalid phone number format');
//     }

//     console.log('harsh Sending OTP to:', formattedPhone);

//     // Get Firebase auth instance
//     const auth = getAuth();
    
//     // Send OTP using Firebase authentication
//     const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);

//     // Successfully sent OTP
//     console.log('OTP sent successfully');
//     window.confirmationResult = confirmationResult; // Store the confirmationResult in global window object
    
//     return confirmationResult;
    
//   } catch (err) {
//     // Log error and rethrow it
//     console.error('harsh Error in sendOTP:', {
//       error: err,
//       message: err.message,
//       stack: err.stack
//     });
//     throw new Error(err.message || 'Failed to send OTP');
//   }
// };



import { signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const sendOTP = async (phoneNumber, verifier) => {
  try {
    // Verify verifier is properly initialized
    if (!verifier || typeof verifier.verify !== 'function') {
      throw new Error('reCAPTCHA verifier not properly initialized');
    }

    const formattedPhone = `+91${phoneNumber.replace(/\D/g, '')}`;
    
    if (!/^\+91\d{10}$/.test(formattedPhone)) {
      throw new Error('Invalid phone number format');
    }

    console.log('Sending OTP to:', formattedPhone);
    const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    
    console.log('OTP sent successfully');
    return confirmation;
    
  } catch (err) {
    console.error('Error in sendOTP:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    throw new Error(err.message || 'Failed to send OTP');
  }
};




