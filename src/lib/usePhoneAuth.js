import { auth, signInWithPhoneNumber, RecaptchaVerifier } from './firebase';

export const setupRecaptcha = () => {
  if (typeof window === 'undefined') return null;
  if (window.recaptchaVerifier) return window.recaptchaVerifier;

  window.recaptchaVerifier = new RecaptchaVerifier(
    'recaptcha-container',
    {
      size: 'invisible',
      callback: (response) => {
        console.log('✅ reCAPTCHA solved', response);
      },
      'expired-callback': () => {
        console.warn('⚠️ reCAPTCHA expired');
      },
    },
    auth
  );

  window.recaptchaVerifier.render().then((id) => {
    console.log('🎯 reCAPTCHA rendered with ID:', id);
  });

  return window.recaptchaVerifier;
};

export const sendOtp = async (phoneNumber) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const verifyOtp = async (confirmationResult, otp) => {
  const result = await confirmationResult.confirm(otp);
  return result.user;
};
