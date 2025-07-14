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
import { app, auth, RecaptchaVerifier } from "@/lib/firebaseConfig";
import { authAPI } from "@/lib/api"; // Import your API
import { loginOrRegisterUser } from "@/services/Auth/auth.service";
import { useDialog } from "@/hooks/use-dialog";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/hooks/cookies";

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const { show } = useDialog();
  const router = useRouter();

  const {
    confirmationResult,
    setConfirmationResult,
    user,
    loading,
    error,
    signup,
    verifyOtpAndLogin,
    updateUser,
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
    if (!isOpen) {
      // Reset forms when modal closes
      loginForm.reset();
      signupForm.reset();
      setIsOtpSent(false);
      setRecaptchaError(null);
      setFormattedPhone("");
    }
  }, [isOpen]);

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
              // console.log("reCAPTCHA solved:", response);
            },
            "expired-callback": () => {
              console.warn("reCAPTCHA expired");
              setIsRecaptchaReady(false);
            },
            "error-callback": (error) => {
              console.error("reCAPTCHA error:", error);
              setRecaptchaError(
                "Security verification failed. Please try again."
              );
              setIsRecaptchaReady(false);
            },
          },
          app // ✅ pass the actual app instance, not `auth.app`
        );

        // Render the recaptcha
        await recaptchaRef.current.render();
        setIsRecaptchaReady(true);
        setRecaptchaError(null);
      } catch (err) {
        console.error("reCAPTCHA initialization failed:", err);

        // If recaptcha has already been rendered in this element
        if (err.message?.includes("already been rendered")) {
          // Optional: show message briefly before reload
          setRecaptchaError(
            "Security verification failed. Refreshing the page..."
          );

          // Wait 1 second then refresh
          setTimeout(() => {
            window.location.href = "/";
            return;
          }, 1000);
          return;
        }

        setRecaptchaError(
          "Security verification failed. Please refresh the page."
        );
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
      // console.log("🚀 ~hasrh handleSendOtp ~ raw:", raw)
      if (!raw || raw.length !== 10) {
        throw new Error("Enter a valid 10-digit number");
      }

      setLocalLoading(true);
      setFormattedPhone(`+91${raw}`);

      if (!recaptchaRef.current || !isRecaptchaReady) {
        throw new Error("Security verification not ready. Please try again.");
      }

      // 🔥 STEP 1: Send OTP via Firebase only
      const confirmation = await sendOTP(raw, recaptchaRef.current);
      setConfirmationResult(confirmation);

      setIsOtpSent(true);
    } catch (err) {
      console.error("❌ Failed to send OTP:", err);

      const errorCode = err.code || err.message || "";
      const shouldReload = [
        "recaptcha has already been rendered",
        "auth/internal-error",
        "auth/internal-error-encountered",
        "auth/too-many-requests",
      ].some((code) => errorCode.includes(code));

      let errorMessage = err.message;

      if (errorCode.includes("auth/invalid-phone-number")) {
        errorMessage = "Invalid phone number format.";
      } else if (errorCode.includes("auth/captcha-check-failed")) {
        errorMessage = "Security verification failed. Please try again.";
      } else if (errorCode.includes("auth/too-many-requests")) {
        errorMessage = "Too many attempts. Refreshing the page...";
      }

      show({
        title: "OTP Error",
        description: errorMessage || "Failed to send OTP",
      });

      if (shouldReload) {
        console.log("🔁 Reloading page due to:", errorCode);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleLogin = async (values) => {
    if (!values.otp || values.otp.length < 4) {
      show({
        title: "Invalid OTP",
        description: "Please enter a valid OTP.",
      });

      return;
    }

    try {
      // ✅ Step 1: Verify OTP with Firebase
      await verifyOtpAndLogin(values.otp);

      const result = await loginOrRegisterUser(formattedPhone);

      if (result?.status === 1 && result?.data?.token) {
        const backendToken = result.data.token;

        // ✅ Save backend token in localStorage (for future API calls)
        setAccessToken(backendToken);

        // ✅ Optional: store in user context for access inside app
        updateUser({
          token: backendToken,
          id: result.data.id,
          phone_number: result.data.phone_number,
          name: result.data.name,
          date_of_birth: result.data.date_of_birth,
          profile_image: result.data.profile_image,
          // Add more user fields if needed
        });

        // console.log("✅ Backend token saved and user updated");
        router.push("/profile");
      } else {
        console.warn("❌ Token not received from backend");
      }

      setIsOtpSent(false);
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
      show({
        title: "Login Failed",
        description: "Please try again.",
      });
    }
  };

  const handleSignup = async (values) => {
    if (!values.name || !values.otp) {
      show({
        title: "Missing Fields",
        description: "Name and OTP are required.",
      });

      return;
    }

    try {
      // 🔥 STEP 1: Verify OTP with Firebase
      await verifyOtpAndLogin(values.otp);

      // 🔥 STEP 2: Also verify with your backend
      try {
        await authAPI.verifyOTP(formattedPhone, values.otp);
        // console.log("Backend OTP verification successful");
      } catch (backendError) {
        // console.warn("Backend OTP verification failed:", backendError);
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
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="auth-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Log In or Sign Up
          </DialogTitle>
          <DialogDescription
            id="auth-modal-description"
            className="text-center"
          >
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
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="login">Login</TabsTrigger>
            {/* <TabsTrigger value="signup">Sign Up</TabsTrigger> */}
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 py-4">
            <Form {...loginForm}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isOtpSent) return; // Prevent accidental form submission before OTP is sent
                  loginForm.handleSubmit(handleLogin)(e);
                }}
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
                      disabled={isOtpSent}
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
          {/* <TabsContent value="signup" className="space-y-4 py-4">
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
          </TabsContent> */}
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
