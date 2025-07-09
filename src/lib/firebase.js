import { signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const sendOTP = async (phoneNumber, verifier) => {
  try {
    logger.info('sendOTP called with phoneNumber:', phoneNumber);
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




