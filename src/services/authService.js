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

  console.log("--------------------------------------------------");
  console.log("📄 [Firestore Step 1] createUserDocument Invoked!");
  console.log("📄 [Firestore Step 1] Target Collection: 'users'");
  console.log("📄 [Firestore Step 1] Document ID (user.uid):", user.uid);
  console.log("--------------------------------------------------");

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

      console.log("⏳ [Firestore Step 3] Writing new user data to users/", user.uid);
      await setDoc(userRef, userData);
      console.log("✅ [Firestore Step 4] SUCCESS! User document created in Firestore 'users/" + user.uid + "'");
      return userData;
    } else {
      console.log("ℹ️ [Firestore Step 3] User document exists for UID:", user.uid, "- Updating missing/new fields.");
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
  console.log("==================================================");
  console.log("🚀 [registerUser] Workflow started for:", email);
  console.log("==================================================");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name });
    }

    await createUserDocument(user, { name, email, phone });

    return { success: true, user };
  } catch (error) {
    console.error("💥 [registerUser Failed]");
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

/**
 * Step 1 of Dual Auth Registration:
 * Create Email/Password User, update displayName, send SMS OTP
 */
export const registerUserStep1SendOtp = async (
  { name, email, password, phone, countryCode = "+91" },
  containerId = "recaptcha-container"
) => {
  console.log("🚀 [Dual Auth Register Step 1] Creating Email/Password user and sending OTP...");

  let formattedPhone = phone.trim().replace(/\s+/g, "");
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = `${countryCode}${formattedPhone}`;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name.trim() });
    }

    const recaptchaVerifier = setupPhoneRecaptcha(containerId);
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

    // Link Phone provider credential to existing Email/Password user account
    await linkWithCredential(currentUser, credential);

    const targetPhone = formattedPhone || currentUser.phoneNumber || "";

    // Force explicit merge write to users/{uid} document with verified phone number
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

    console.log("🎉 [Dual Auth Register Complete] Single UID linked to Email + Phone & Firestore phone saved!");
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

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("✅ reCAPTCHA solved successfully");
    },
    "expired-callback": () => {
      console.warn("⚠️ reCAPTCHA expired");
    },
  });

  return window.recaptchaVerifier;
};

/**
 * Send Phone OTP Verification Code via Firebase Auth
 */
export const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container") => {
  console.log("🚀 [Phone Auth] Initializing sendPhoneOtp for:", phoneNumber);

  try {
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
