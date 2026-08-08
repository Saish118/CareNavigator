import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  RecaptchaVerifier,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * Diagnostic logger for Firebase Auth & Firestore instances
 */
console.log("🔥 [Firebase Init Check] Auth & DB instances:");
console.log("🔥 [Firebase Auth Instance]:", auth ? "OK" : "MISSING");
console.log("🔥 [Firebase Firestore DB Instance]:", db ? "OK" : "MISSING");

/**
 * Format any phone number input into strict E.164 format (+[countrycode][number])
 */
export const formatE164PhoneNumber = (phone, defaultCountryCode = "+91") => {
  if (!phone) return "";
  let clean = phone.trim().replace(/[^\d+]/g, "");
  if (!clean.startsWith("+")) {
    clean = `${defaultCountryCode}${clean.replace(/^0+/, "")}`;
  }
  return clean;
};

/**
 * Detailed diagnostic Firebase authentication error code translator
 */
const getFriendlyErrorMessage = (error) => {
  const errorCode = error?.code || "";
  console.error("🔥 [FIREBASE AUTH DETAILED DIAGNOSTICS]:", {
    code: errorCode,
    message: error?.message,
    fullError: error,
  });

  switch (errorCode) {
    case "permission-denied":
    case "firestore/permission-denied":
      return "Firestore Security Rules Permission Denied. Please enable read/write permissions in Firebase Console > Firestore Database > Rules.";
    case "not-found":
    case "firestore/not-found":
      return "Firestore Database not created yet. Please go to Firebase Console > Firestore Database and click 'Create Database'.";
    case "auth/operation-not-allowed":
      return `Firebase Phone Authentication error (auth/operation-not-allowed): Phone provider or domain authorization is disabled in Firebase Console > Authentication > Sign-in method. Details: ${error?.message || ""}`;
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
      return `Invalid phone number format (${error?.message || ""}). Please enter a valid number with country code e.g. +91 9511276511.`;
    case "auth/missing-phone-number":
      return "Please enter your mobile phone number.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded for this Firebase project. Try again later or sign in with Email.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please refresh and try again.";
    case "auth/invalid-verification-code":
      return "Incorrect 6-digit OTP code. Please check and try again.";
    case "auth/code-expired":
      return "OTP verification code has expired. Please request a new code.";
    case "auth/credential-already-in-use":
    case "auth/phone-number-already-exists":
      return "This phone number is already linked to another CareNavigator account. Please use a different number or sign in with your phone.";
    case "auth/provider-already-linked":
      return "This account is already linked with phone authentication.";
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

  console.log("📄 [Firestore] createUserDocument target users/", user.uid);
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);
    const resolvedPhone = additionalData.phone || user.phoneNumber || "";

    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || (user.phoneNumber ? `User ${user.phoneNumber.slice(-4)}` : ""),
        email: additionalData.email || user.email || "",
        phone: resolvedPhone,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("⏳ [Firestore] Writing new user data to users/", user.uid, userData);
      await setDoc(userRef, userData);
      console.log("✅ [Firestore] SUCCESS! User document created in Firestore 'users/" + user.uid + "'");
      return userData;
    } else {
      console.log("ℹ️ [Firestore] User document exists for UID:", user.uid, "- Updating missing/new fields.");
      const existingData = userSnap.data();
      const updates = {};

      if ((!existingData.name || existingData.name.trim() === "") && (additionalData.name || user.displayName)) {
        updates.name = additionalData.name || user.displayName;
      }
      if ((!existingData.email || existingData.email.trim() === "") && (additionalData.email || user.email)) {
        updates.email = additionalData.email || user.email;
      }
      if ((!existingData.phone || existingData.phone.trim() === "") && resolvedPhone) {
        updates.phone = resolvedPhone;
      } else if (additionalData.phone && additionalData.phone.trim() !== "" && existingData.phone !== additionalData.phone) {
        updates.phone = additionalData.phone;
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = serverTimestamp();
        await setDoc(userRef, updates, { merge: true });
      }
      return { ...existingData, ...updates };
    }
  } catch (error) {
    console.error("💥 [Firestore Step CATCH] Error in createUserDocument:", error);
    throw error;
  }
};

/**
 * Register a new user with Email, Password, and Display Name
 */
export const registerUser = async (name, email, password, phone = "") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name });
    }

    await createUserDocument(user, { name, email, phone });
    return { success: true, user };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Initialize reCAPTCHA Verifier for Phone Authentication
 */
export const setupPhoneRecaptcha = (containerId = "recaptcha-container") => {
  console.log("🔍 [reCAPTCHA Init] Container ID:", containerId);
  const containerEl = document.getElementById(containerId);
  if (!containerEl) {
    console.error("❌ [reCAPTCHA Error] Container element missing:", containerId);
    throw new Error(`reCAPTCHA container element (#${containerId}) was not found in the DOM.`);
  }

  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
      console.log("🧹 [reCAPTCHA] Cleared previous verifier instance.");
    } catch (e) {
      console.warn("⚠️ [reCAPTCHA Warning] Error clearing previous verifier:", e.message);
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: (response) => {
      console.log("✅ [reCAPTCHA Callback] Solved successfully. Token present.");
    },
    "expired-callback": () => {
      console.warn("⚠️ [reCAPTCHA Callback] Token expired.");
    },
  });

  return window.recaptchaVerifier;
};

/**
 * Step 1 of Dual Auth Registration:
 * Create Email/Password User, update displayName, send SMS OTP
 */
export const registerUserStep1SendOtp = async (
  { name, email, password, phone, countryCode = "+91" },
  containerId = "recaptcha-container"
) => {
  const formattedPhone = formatE164PhoneNumber(phone, countryCode);
  console.log("🚀 [Dual Auth Register Step 1] Creating user and sending OTP to E.164:", formattedPhone);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name.trim() });
    }

    const recaptchaVerifier = setupPhoneRecaptcha(containerId);
    await recaptchaVerifier.render();
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);

    return { user, confirmationResult, formattedPhone };
  } catch (error) {
    console.error("💥 [registerUserStep1SendOtp Failed]:", error);
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Step 2 of Dual Auth Registration:
 * Verify OTP, link Phone Provider to SAME user account, force save phone in Firestore
 */
export const registerUserStep2VerifyAndLink = async ({
  user,
  confirmationResult,
  otpCode,
  name,
  email,
  formattedPhone,
}) => {
  console.log("🚀 [Dual Auth Register Step 2] Verifying OTP and linking phone credential...");

  try {
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otpCode.trim());
    const currentUser = auth.currentUser || user;

    await linkWithCredential(currentUser, credential);

    const targetPhone = formattedPhone || currentUser.phoneNumber || "";

    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        uid: currentUser.uid,
        name: name || currentUser.displayName || "",
        email: email || currentUser.email || "",
        phone: targetPhone,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("🎉 [Dual Auth Register Complete] Single UID linked & Firestore phone saved!");
    return { success: true, user: currentUser };
  } catch (error) {
    console.error("💥 [registerUserStep2VerifyAndLink Failed]:", error);
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
 * Send Phone OTP Verification Code via Firebase Auth with E.164 formatting & reCAPTCHA render
 */
export const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container", countryCode = "+91") => {
  const formattedPhone = formatE164PhoneNumber(phoneNumber, countryCode);

  console.log("==================================================");
  console.log("🚀 [sendPhoneOtp] Initializing Phone Auth OTP Dispatch");
  console.log("🚀 [sendPhoneOtp] Input Raw Phone:", phoneNumber);
  console.log("🚀 [sendPhoneOtp] Target E.164 Phone:", formattedPhone);
  console.log("==================================================");

  try {
    const recaptchaVerifier = setupPhoneRecaptcha(containerId);

    console.log("⏳ [sendPhoneOtp] Rendering reCAPTCHA widget...");
    await recaptchaVerifier.render();
    console.log("✅ [sendPhoneOtp] reCAPTCHA widget rendered successfully!");

    console.log("⏳ [sendPhoneOtp] Executing signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier)...");
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);

    console.log("🎉 [sendPhoneOtp] SUCCESS! SMS OTP sent to:", formattedPhone);
    return { success: true, confirmationResult, formattedPhone };
  } catch (error) {
    console.error("💥 [sendPhoneOtp Failed!]");
    console.error("💥 [Error Code]:", error?.code);
    console.error("💥 [Error Message]:", error?.message);
    console.error("💥 [Full Error Object]:", error);

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
