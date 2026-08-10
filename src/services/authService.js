import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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
  const trimmed = phone.trim();
  let clean = trimmed.replace(/[^\d+]/g, "");
  if (!clean.startsWith("+")) {
    const rawDigits = clean.replace(/^0+/, "");
    const cleanCountry = defaultCountryCode.startsWith("+") ? defaultCountryCode : `+${defaultCountryCode}`;
    clean = `${cleanCountry}${rawDigits}`;
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
      return "Firestore Security Rules Permission Denied. Unauthenticated access is restricted for security.";
    case "not-found":
    case "firestore/not-found":
      return "Firestore Database resource not found.";
    case "auth/operation-not-allowed":
      return `Firebase Phone Authentication error (auth/operation-not-allowed): Phone provider is disabled in Firebase Console > Authentication > Sign-in method.`;
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
      return "Too many failed attempts. Account temporarily locked for security. Try again later.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
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
    const userEmail = (additionalData.email || user.email || "").toLowerCase().trim();
    const isAdminAccount = userEmail === "joshisaish2004@gmail.com" || additionalData.role === "admin";

    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || (user.phoneNumber ? `User ${user.phoneNumber.slice(-4)}` : ""),
        email: userEmail,
        phone: resolvedPhone,
        bloodGroup: additionalData.bloodGroup || "O+",
        role: isAdminAccount ? "admin" : (additionalData.role || "user"),
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

      if (isAdminAccount && existingData.role !== "admin") {
        updates.role = "admin";
      }

      if ((!existingData.name || existingData.name.trim() === "") && (additionalData.name || user.displayName)) {
        updates.name = additionalData.name || user.displayName;
      }
      if ((!existingData.email || existingData.email.trim() === "") && userEmail) {
        updates.email = userEmail;
      }
      if ((!existingData.phone || existingData.phone.trim() === "") && resolvedPhone) {
        updates.phone = resolvedPhone;
      } else if (additionalData.phone && additionalData.phone.trim() !== "" && existingData.phone !== additionalData.phone) {
        updates.phone = additionalData.phone;
      }
      if (!existingData.bloodGroup && additionalData.bloodGroup) {
        updates.bloodGroup = additionalData.bloodGroup;
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
 * Register a new user with Name, Email, Mobile Number, Blood Group, and Password
 */
export const registerUser = async (name, email, password, phone = "", bloodGroup = "O+", countryCode = "+91") => {
  const formattedPhone = phone ? formatE164PhoneNumber(phone, countryCode) : "";
  console.log("🚀 [registerUser] Creating user:", email, "Phone:", formattedPhone);

  try {
    // 1. Create Firebase Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // 2. Set Display Name in Firebase Auth Profile
    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name.trim() });
    }

    // 3. Create Firestore User Document users/{uid}
    await createUserDocument(user, {
      name: name.trim(),
      email: email.trim(),
      phone: formattedPhone,
      bloodGroup: bloodGroup,
    });

    console.log("✅ [registerUser] Registered & provisioned users/", user.uid);
    return { success: true, user };
  } catch (error) {
    console.error("💥 [registerUser Failed]:", error);
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
 * Send password reset email via Firebase Auth
 */
export const resetPassword = async (email) => {
  console.log("🚀 [resetPassword] Sending password reset email to:", email);
  try {
    await sendPasswordResetEmail(auth, email.trim());
    console.log("✅ [resetPassword] Reset email sent successfully to:", email);
    return { success: true };
  } catch (error) {
    console.error("💥 [resetPassword Failed]:", error);
    if (error.code === "auth/user-not-found") {
      return { success: true };
    }
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

// Module-level singleton reference for RecaptchaVerifier (preserved for production SMS OTP deployment)
let globalRecaptchaVerifier = null;

export const resetRecaptchaVerifier = () => {
  if (globalRecaptchaVerifier) {
    try {
      globalRecaptchaVerifier.render().then((widgetId) => {
        if (window.grecaptcha && typeof window.grecaptcha.reset === "function") {
          window.grecaptcha.reset(widgetId);
        }
      }).catch(() => {});
    } catch (e) {}
  }
};

export const clearRecaptchaVerifier = (containerId = "recaptcha-container") => {
  if (globalRecaptchaVerifier) {
    try {
      globalRecaptchaVerifier.clear();
    } catch (e) {}
    globalRecaptchaVerifier = null;
  }
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {}
    window.recaptchaVerifier = null;
  }
  const containerEl = document.getElementById(containerId);
  if (containerEl) {
    containerEl.innerHTML = "";
  }
};

export const getOrCreateRecaptchaVerifier = (containerId = "recaptcha-container") => {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) {
    throw new Error(`reCAPTCHA container element (#${containerId}) was not found in the DOM.`);
  }
  if (globalRecaptchaVerifier) return globalRecaptchaVerifier;
  if (window.recaptchaVerifier) {
    globalRecaptchaVerifier = window.recaptchaVerifier;
    return globalRecaptchaVerifier;
  }
  containerEl.innerHTML = "";
  globalRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
    "expired-callback": () => resetRecaptchaVerifier(),
  });
  window.recaptchaVerifier = globalRecaptchaVerifier;
  return globalRecaptchaVerifier;
};

export const setupPhoneRecaptcha = getOrCreateRecaptchaVerifier;

export const registerUserStep1SendOtp = async (
  { name, email, password, phone, countryCode = "+91" },
  containerId = "recaptcha-container"
) => {
  const formattedPhone = formatE164PhoneNumber(phone, countryCode);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name.trim() });
    }
    const recaptchaVerifier = getOrCreateRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return { user, confirmationResult, formattedPhone };
  } catch (error) {
    resetRecaptchaVerifier();
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

export const registerUserStep2VerifyAndLink = async ({
  user,
  confirmationResult,
  otpCode,
  name,
  email,
  formattedPhone,
}) => {
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
    return { success: true, user: currentUser };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

export const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container", countryCode = "+91") => {
  const formattedPhone = formatE164PhoneNumber(phoneNumber, countryCode);
  try {
    const recaptchaVerifier = getOrCreateRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return { success: true, confirmationResult, formattedPhone };
  } catch (error) {
    resetRecaptchaVerifier();
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

export const verifyPhoneOtp = async (confirmationResult, otpCode) => {
  try {
    const userCredential = await confirmationResult.confirm(otpCode.trim());
    const user = userCredential.user;
    await createUserDocument(user, { phone: user.phoneNumber }).catch(() => {});
    return { success: true, user };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
  } catch (error) {
    console.warn("⚠️ [getUserProfile Notice]:", error.message);
  }
  return null;
};
