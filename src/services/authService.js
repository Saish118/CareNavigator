import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * Diagnostic logger for Firebase Auth & Firestore instances
 */
console.log("🔥 [Firebase Init] checking auth and db instances...");
console.log("🔥 [Firebase Auth Instance]:", auth ? "OK" : "MISSING");
console.log("🔥 [Firebase Firestore DB Instance]:", db ? "OK" : "MISSING");

/**
 * User-friendly Firebase authentication error code translator
 */
const getFriendlyErrorMessage = (error) => {
  const errorCode = error?.code || "";
  console.error("❌ [Firebase Error Object]:", error);
  console.error("❌ [Firebase Error Code]:", errorCode);
  console.error("❌ [Firebase Error Message]:", error?.message);

  switch (errorCode) {
    case "permission-denied":
    case "firestore/permission-denied":
      return "Firestore Security Rules Permission Denied. Please enable read/write permissions in Firebase Console > Firestore Database > Rules.";
    case "not-found":
    case "firestore/not-found":
      return "Firestore Database not created yet. Please go to Firebase Console > Firestore Database and click 'Create Database'.";
    case "auth/operation-not-allowed":
      return "Phone/Email sign-in is disabled in your Firebase Console. Enable 'Phone' & 'Email/Password' under Firebase Console > Authentication > Sign-in method.";
    case "auth/email-already-in-use":
      return "This email address is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please check your credentials.";
    case "auth/too-many-requests":
      return "Too many failed attempts or SMS requests. Account temporarily locked for security. Try again later.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/invalid-phone-number":
      return "Invalid phone number. Please include full country code e.g. +91 9876543210.";
    case "auth/missing-phone-number":
      return "Please enter your mobile phone number.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later or use Email sign-in.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/invalid-verification-code":
      return "Incorrect 6-digit OTP code. Please check and try again.";
    case "auth/code-expired":
      return "OTP verification code has expired. Please request a new code.";
    default:
      return error?.message || "An unexpected authentication error occurred. Please try again.";
  }
};

/**
 * Automatically create a document in the "users" collection for a user
 * using user.uid as Document ID. Does not overwrite if document already exists.
 */
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user || !user.uid) {
    console.warn("⚠️ [Firestore] createUserDocument called with missing user or user.uid:", user);
    return null;
  }

  console.log("--------------------------------------------------");
  console.log("📄 [Firestore Step 1] createUserDocument Invoked!");
  console.log("📄 [Firestore Step 1] Target Collection: 'users'");
  console.log("📄 [Firestore Step 1] Document ID (user.uid):", user.uid);
  console.log("--------------------------------------------------");

  const userRef = doc(db, "users", user.uid);

  try {
    console.log("⏳ [Firestore Step 2] Checking if document exists via getDoc(userRef)...");
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || (user.phoneNumber ? `User ${user.phoneNumber.slice(-4)}` : ""),
        email: user.email || "",
        phone: additionalData.phone || user.phoneNumber || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("⏳ [Firestore Step 3] Document does not exist. Writing data to users/", user.uid);
      console.log("📄 [Firestore Step 3] Payload:", userData);

      // Perform setDoc write
      await setDoc(userRef, userData);

      console.log("✅ [Firestore Step 4] SUCCESS! User document created in Firestore 'users/" + user.uid + "'");
      return userData;
    } else {
      console.log("ℹ️ [Firestore Step 3] User document already exists for UID:", user.uid, "- Not overwriting.");
      return userSnap.data();
    }
  } catch (error) {
    console.error("💥 [Firestore Step CATCH] Error in createUserDocument:");
    console.error("💥 [Firestore Error Code]:", error.code);
    console.error("💥 [Firestore Error Message]:", error.message);
    console.error("💥 [Firestore Error Stack]:", error.stack);
    throw error;
  }
};

/**
 * Register a new user with Email, Password, and Display Name
 */
export const registerUser = async (name, email, password, phone = "") => {
  console.log("==================================================");
  console.log("🚀 [registerUser] Workflow started for:", email);
  console.log("==================================================");

  try {
    console.log("⏳ [Step 1: Auth] Executing createUserWithEmailAndPassword()...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("✅ [Step 1: Auth] SUCCESS! New User UID:", user?.uid);

    if (name && name.trim() !== "") {
      console.log("⏳ [Step 2: Profile] Updating displayName to:", name);
      await updateProfile(user, { displayName: name });
      console.log("✅ [Step 2: Profile] displayName updated successfully!");
    }

    console.log("⏳ [Step 3: Firestore] Triggering createUserDocument()...");
    await createUserDocument(user, { name, phone });
    console.log("🎉 [registerUser Workflow Complete] Auth & Firestore user provisioned!");

    return { success: true, user };
  } catch (error) {
    console.error("💥 [registerUser Failed]");
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Sign in an existing user with Email and Password
 */
export const loginUser = async (email, password) => {
  console.log("🚀 [loginUser] Calling signInWithEmailAndPassword for:", email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ [Firebase Auth] Login SUCCESSFUL for UID:", userCredential.user?.uid);

    // Ensure document exists in Firestore (creates only if missing)
    await createUserDocument(userCredential.user).catch((err) => {
      console.warn("⚠️ [Firestore Notice] Document check on login warning:", err.message);
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("💥 [loginUser Catch Block Triggered!]");
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Initialize reCAPTCHA Verifier for Phone Authentication
 */
export const setupPhoneRecaptcha = (containerId = "recaptcha-container") => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.log("Clearing previous recaptchaVerifier");
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    {
      size: "invisible",
      callback: () => {
        console.log("✅ reCAPTCHA solved successfully");
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired");
      },
    }
  );

  return window.recaptchaVerifier;
};

/**
 * Send Phone OTP Verification Code via Firebase Auth
 */
export const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container") => {
  console.log("🚀 [Phone Auth] Initializing sendPhoneOtp for:", phoneNumber);

  try {
    // Standardize phone number format (default +91 if no + provided)
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const recaptchaVerifier = setupPhoneRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    
    console.log("✅ [Phone Auth] SMS OTP sent successfully!");
    return { success: true, confirmationResult, formattedPhone };
  } catch (error) {
    console.error("💥 [Phone Auth sendPhoneOtp Failed]:", error);
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
      window.recaptchaVerifier = null;
    }
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Verify Phone OTP Code and Complete Login / User Provisioning
 */
export const verifyPhoneOtp = async (confirmationResult, otpCode) => {
  console.log("🚀 [Phone Auth] Verifying OTP code...");
  try {
    const userCredential = await confirmationResult.confirm(otpCode.trim());
    const user = userCredential.user;

    console.log("✅ [Phone Auth] OTP Verified! Logged in user UID:", user?.uid);

    // Automatically create Firestore users/{uid} document if missing (does not overwrite existing)
    await createUserDocument(user, { phone: user.phoneNumber }).catch((err) => {
      console.warn("⚠️ [Firestore Notice] Document check on phone login warning:", err.message);
    });

    return { success: true, user };
  } catch (error) {
    console.error("💥 [Phone Auth verifyPhoneOtp Failed]:", error);
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Sign out the currently authenticated user
 */
export const logoutUser = async () => {
  console.log("🚀 [logoutUser] Calling signOut()...");
  try {
    await signOut(auth);
    console.log("✅ [Firebase Auth] SignOut SUCCESSFUL!");
    return { success: true };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Get the currently authenticated Firebase user instance synchronously
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
