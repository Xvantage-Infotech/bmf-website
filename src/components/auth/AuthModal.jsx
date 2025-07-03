// 'use client';
// import { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { Form } from '@/components/ui/form';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '@/contexts/AuthContext';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2 } from 'lucide-react';
// import { api } from '@/axiosApi';
// import { createRecaptchaVerifier, sendOTP } from '@/lib/firebaseConfig';

// export default function AuthModal({ isOpen, onClose }) {
//   const [activeTab, setActiveTab] = useState('login');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [formattedPhone, setFormattedPhone] = useState('');
//   const [localLoading, setLocalLoading] = useState(false);

// const {
//   confirmationResult,
//   setConfirmationResult,
//   // ADD THESE ↓
//   user,
//   loading,
//   error,
//   signup,
//   verifyOtpAndLogin,
//   clearError
// } = useAuth();

//   const loginForm = useForm({
//     defaultValues: {
//       mobileNumber: '',
//       otp: ''
//     }
//   });

//   const signupForm = useForm({
//     defaultValues: {
//       name: '',
//       mobileNumber: '',
//       otp: ''
//     }
//   });
//   useEffect(() => {
//   if (typeof window !== 'undefined') {
//     let el = document.getElementById('recaptcha-container');
//     if (!el) {
//       const div = document.createElement('div');
//       div.id = 'recaptcha-container';
//       div.style.display = 'none';
//       document.body.appendChild(div);
//       console.log('✅ Mounted #recaptcha-container manually');
//     }
//   }
// }, []);

//   // AuthModal.jsx
// // useEffect(() => {
// //   return () => {
// //     if (window.recaptchaVerifier) {
// //       window.recaptchaVerifier.clear();
// //       window.recaptchaVerifier = null;
// //       console.log('🧹 Cleared reCAPTCHA verifier');
// //     }
// //   };
// // }, []);

//   useEffect(() => {
//     if (isOpen && !isOtpSent) {
//       clearError();
//     }
//   }, [isOpen, isOtpSent, clearError]);

//   const formatPhoneNumber = (phone) => {
//     const digits = phone.replace(/\D/g, '');
//     if (!phone.startsWith('+')) {
//       return `${digits}`;
//     }
//     return phone;
//   };

// // AuthModal.jsx
// const handleSendOtp = async (phoneNumber) => {
//   try {
//     setLocalLoading(true);

//     // ⏳ Give DOM time to mount
//     await new Promise((r) => setTimeout(r, 100));

//     if (!window.recaptchaVerifier) {
//       const verifier = createRecaptchaVerifier();
//       if (!verifier) throw new Error('Recaptcha not initialized');
//     }

//     const confirmation = await sendOTP(phoneNumber);
//     setConfirmationResult(confirmation);
//     setIsOtpSent(true);
//   } catch (err) {
//     console.error('❌ Failed to send OTP:', err);
//     alert(err.message);
//   } finally {
//     setLocalLoading(false);
//   }
// };

//   const handleVerifyOtp = async () => {
//     try {
//       const result = await confirmationResult.confirm(otp);
//       console.log('✅ Logged in user:', result.user);
//       alert('Login successful!');
//     } catch (err) {
//       console.error('❌ Invalid OTP:', err);
//       alert('Invalid OTP');
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = null;
//       }
//     };
//   }, []);

// const handleLogin = async (values) => {
//   if (!values.otp || values.otp.length < 4) {
//     alert('Please enter a valid OTP');
//     return;
//   }
//   try {
//     await verifyOtpAndLogin(values.otp);
//     setIsOtpSent(false);
//     onClose();
//   } catch (error) {
//     console.error('Error during login:', error);
//   }
// };

//   const handleSignup = async (values) => {
//     if (!values.otp || values.otp.length < 4) {
//       alert('Please enter a valid OTP');
//       return;
//     }

//     if (!values.name) {
//       alert('Please enter your name');
//       return;
//     }

//     try {
//       await verifyOtpAndLogin(values.otp, formattedPhone);

//       await signup({
//         name: values.name,
//         mobileNumber: formattedPhone
//       });
//       setIsOtpSent(false);
//       onClose();
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//     }
//   };

//   return (

//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-center text-xl font-semibold">
//             Log In or Sign Up
//           </DialogTitle>
//         </DialogHeader>

//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="login">Login</TabsTrigger>
//             <TabsTrigger value="signup">Sign Up</TabsTrigger>
//           </TabsList>

//           <TabsContent value="login" className="space-y-4 py-4">
//             <Form {...loginForm}>
//               <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="login-mobile">Enter your Mobile Number</Label>
//                   <div className="flex">
//                     <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
//                       <span className="text-sm">+91</span>
//                     </div>
//                     <Input
//                       id="login-mobile"
//                       type="tel"
//                       placeholder="Mobile Number"
//                       className="rounded-l-none"
//                       {...loginForm.register('mobileNumber')}
//                     />
//                   </div>
//                 </div>

//                 {isOtpSent ? (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="login-otp">Enter OTP</Label>
//                       <Input
//                         id="login-otp"
//                         type="text"
//                         placeholder="Enter OTP"
//                         {...loginForm.register('otp')}
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       className="w-full bg-primary text-white hover:bg-primary/90"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Verifying...
//                         </>
//                       ) : (
//                         'Login'
//                       )}
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     id="login-otp-button"
//                     type="button"
//                     className="w-full bg-primary text-white hover:bg-primary/90"
//                     onClick={() => handleSendOtp(loginForm.getValues('mobileNumber'))}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Sending OTP...
//                       </>
//                     ) : (
//                       'Get OTP'
//                     )}
//                   </Button>
//                 )}
//               </form>
//             </Form>
//           </TabsContent>

//           <TabsContent value="signup" className="space-y-4 py-4">
//             <Form {...signupForm}>
//               <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-name">Full Name</Label>
//                   <Input
//                     id="signup-name"
//                     type="text"
//                     placeholder="Your Name"
//                     {...signupForm.register('name')}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="signup-mobile">Mobile Number</Label>
//                   <div className="flex">
//                     <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
//                       <span className="text-sm">+91</span>
//                     </div>
//                     <Input
//                       id="signup-mobile"
//                       type="tel"
//                       placeholder="Mobile Number"
//                       className="rounded-l-none"
//                       {...signupForm.register('mobileNumber')}
//                     />
//                   </div>
//                 </div>

//                 {isOtpSent ? (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="signup-otp">Enter OTP</Label>
//                       <Input
//                         id="signup-otp"
//                         type="text"
//                         placeholder="Enter OTP"
//                         {...signupForm.register('otp')}
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       className="w-full bg-primary text-white hover:bg-primary/90"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Creating Account...
//                         </>
//                       ) : (
//                         'Create Account'
//                       )}
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     id="signup-otp-button"
//                     type="button"
//                     className="w-full bg-primary text-white hover:bg-primary/90"
//                     onClick={() => handleSendOtp(signupForm.getValues('mobileNumber'))}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Sending OTP...
//                       </>
//                     ) : (
//                       'Get OTP'
//                     )}
//                   </Button>
//                 )}
//               </form>
//             </Form>
//           </TabsContent>
//         </Tabs>

//         <div className="mt-4 text-center text-sm text-muted-foreground">
//           By clicking, I accept the{' '}
//           <a href="#" className="text-primary hover:underline">
//             Terms & Conditions
//           </a>{' '}
//           and{' '}
//           <a href="#" className="text-primary hover:underline">
//             Privacy Policy
//           </a>
//         </div>

//       </DialogContent>
//     </Dialog>

//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { sendOTP } from "@/lib/firebase";
import { auth, RecaptchaVerifier } from "@/lib/firebaseConfig";
import { authAPI } from "@/lib/api"; // Import your API

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const {
    confirmationResult,
    setConfirmationResult,
    user,
    loading,
    error,
    signup,
    verifyOtpAndLogin,
    clearError,
  } = useAuth();

  const loginForm = useForm({
    defaultValues: { mobileNumber: "", otp: "" },
  });

  const signupForm = useForm({
    defaultValues: { name: "", mobileNumber: "", otp: "" },
  });

  const recaptchaRef = useRef(null);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const initializeRecaptcha = async () => {
      try {
        // Clean up existing recaptcha
        if (recaptchaRef.current) {
          try {
            await recaptchaRef.current.clear();
          } catch (e) {
            console.warn("Error clearing existing recaptcha:", e);
          }
          recaptchaRef.current = null;
        }

        // Ensure auth is available
        if (!auth) {
          throw new Error("Firebase auth not initialized");
        }

        // Create container if it doesn't exist
        let container = document.getElementById("recaptcha-container");
        if (!container) {
          container = document.createElement("div");
          container.id = "recaptcha-container";
          container.style.display = "none";
          document.body.appendChild(container);
        }

        // Wait a bit for DOM to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Create new RecaptchaVerifier
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA verified:", response);
            },
            "expired-callback": () => {
              console.warn("reCAPTCHA expired");
              setIsRecaptchaReady(false);
            },
            "error-callback": (error) => {
              console.error("reCAPTCHA error:", error);
              setRecaptchaError("Security verification failed. Please try again.");
              setIsRecaptchaReady(false);
            }
          }
        );

        // Render the recaptcha
        await recaptchaRef.current.render();
        setIsRecaptchaReady(true);
        setRecaptchaError(null);
        
      } catch (err) {
        console.error("reCAPTCHA initialization failed:", err);
        setRecaptchaError("Security verification failed. Please refresh the page.");
        setIsRecaptchaReady(false);
      }
    };

    initializeRecaptcha();

    return () => {
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
        } catch (e) {
          console.warn("reCAPTCHA cleanup error:", e);
        }
        recaptchaRef.current = null;
      }
      setIsRecaptchaReady(false);
    };
  }, [isOpen]);

  const handleSendOtp = async (phoneNumber) => {
    try {
      const raw = phoneNumber.replace(/\D/g, "");
      if (!raw || raw.length !== 10) {
        throw new Error("Enter a valid 10-digit number");
      }

      setLocalLoading(true);
      setFormattedPhone(`+91${raw}`);

      // Verify recaptcha is ready
      if (!recaptchaRef.current || !isRecaptchaReady) {
        throw new Error("Security verification not ready. Please try again.");
      }

      // 🔥 STEP 1: Send OTP via Firebase (for frontend verification)
      console.log("Sending Firebase OTP...");
      const confirmation = await sendOTP(raw, recaptchaRef.current);
      setConfirmationResult(confirmation);
      
      // 🔥 STEP 2: Also call your backend API (for backend processing)
      console.log("Calling backend API...");
      try {
        await authAPI.sendOTP(`+91${raw}`);
        console.log("Backend API called successfully");
      } catch (backendError) {
        console.warn("Backend API failed (continuing with Firebase):", backendError);
        // Continue with Firebase flow even if backend fails
      }

      setIsOtpSent(true);
      
    } catch (err) {
      console.error("❌ Failed to send OTP:", err);

      // User-friendly error messages
      let errorMessage = err.message;
      if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (err.code === "auth/captcha-check-failed") {
        errorMessage = "Security verification failed. Please try again.";
      }

      alert(errorMessage || "Failed to send OTP");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleLogin = async (values) => {
    if (!values.otp || values.otp.length < 4) {
      alert("Please enter a valid OTP");
      return;
    }
    try {
      // 🔥 STEP 1: Verify OTP with Firebase
      await verifyOtpAndLogin(values.otp);
      
      // 🔥 STEP 2: Also verify with your backend
      try {
        await authAPI.verifyOTP(formattedPhone, values.otp);
        console.log("Backend OTP verification successful");
      } catch (backendError) {
        console.warn("Backend OTP verification failed:", backendError);
        // Continue with Firebase flow
      }
      
      setIsOtpSent(false);
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async (values) => {
    if (!values.name || !values.otp) {
      alert("Name and OTP are required");
      return;
    }

    try {
      // 🔥 STEP 1: Verify OTP with Firebase
      await verifyOtpAndLogin(values.otp);
      
      // 🔥 STEP 2: Also verify with your backend
      try {
        await authAPI.verifyOTP(formattedPhone, values.otp);
        console.log("Backend OTP verification successful");
      } catch (backendError) {
        console.warn("Backend OTP verification failed:", backendError);
      }
      
      // 🔥 STEP 3: Create user account
      await signup({
        name: values.name,
        mobileNumber: formattedPhone,
      });
      
      setIsOtpSent(false);
      onClose();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="auth-modal-description">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Log In or Sign Up
          </DialogTitle>
          <DialogDescription id="auth-modal-description" className="text-center">
            Enter your mobile number to continue with OTP verification
          </DialogDescription>
        </DialogHeader>

        {recaptchaError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{recaptchaError}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 py-4">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-mobile">Mobile Number</Label>
                  <div className="flex">
                    <div className="px-3 flex items-center bg-muted border border-r-0 rounded-l-md">
                      +91
                    </div>
                    <Input
                      id="login-mobile"
                      type="tel"
                      placeholder="Mobile Number"
                      className="rounded-l-none"
                      {...loginForm.register("mobileNumber")}
                    />
                  </div>
                </div>

                {isOtpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login-otp">OTP</Label>
                      <Input
                        id="login-otp"
                        type="text"
                        placeholder="Enter OTP"
                        maxLength={6}
                        {...loginForm.register("otp")}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() =>
                      handleSendOtp(loginForm.getValues("mobileNumber"))
                    }
                    disabled={
                      localLoading || !isRecaptchaReady || recaptchaError
                    }
                  >
                    {localLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : recaptchaError ? (
                      "Security Error"
                    ) : isRecaptchaReady ? (
                      "Get OTP"
                    ) : (
                      "Preparing security..."
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4 py-4">
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your Name"
                    {...signupForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-mobile">Mobile Number</Label>
                  <div className="flex">
                    <div className="px-3 flex items-center bg-muted border border-r-0 rounded-l-md">
                      +91
                    </div>
                    <Input
                      id="signup-mobile"
                      type="tel"
                      placeholder="Mobile Number"
                      className="rounded-l-none"
                      {...signupForm.register("mobileNumber")}
                    />
                  </div>
                </div>

                {isOtpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-otp">OTP</Label>
                      <Input
                        id="signup-otp"
                        type="text"
                        placeholder="Enter OTP"
                        maxLength={6}
                        {...signupForm.register("otp")}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() =>
                      handleSendOtp(signupForm.getValues("mobileNumber"))
                    }
                    disabled={
                      localLoading || !isRecaptchaReady || recaptchaError
                    }
                  >
                    {localLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : recaptchaError ? (
                      "Security Error"
                    ) : isRecaptchaReady ? (
                      "Get OTP"
                    ) : (
                      "Preparing security..."
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          By clicking, I accept the{" "}
          <a href="#" className="text-primary hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </div>
      </DialogContent>

      <div id="recaptcha-container" />
    </Dialog>
  );
}