import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const FIREBASE_TOKEN_KEY = "firebase_token";

const isProd = process.env.NODE_ENV === "production";

// Save tokens
// Set tokens without expiry — session-only
export const setAccessToken = (token) => {
  Cookies.set("access_token", token, {
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });

    if (process.env.NODE_ENV !== "production") {
    console.log("✅ Access token set:", token);
  }

};

export const setFirebaseToken = (token) => {
  Cookies.set("firebase_token", token, {
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  if (process.env.NODE_ENV !== "production") {
    console.log("📲 Firebase token set:", token);
  }
};


// Get tokens
export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
export const getFirebaseToken = () => Cookies.get(FIREBASE_TOKEN_KEY);

// Remove tokens (e.g., on logout)
export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(FIREBASE_TOKEN_KEY);
};
