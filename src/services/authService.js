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
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
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
      return "Invalid credentials. Please check your email/mobile number and password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Account temporarily locked for security. Try again later.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/invalid-phone-number":
      return `Invalid phone number format (${error?.message || ""}). Please enter a valid number with country code e.g. +91 9511276511 or +1 650-555-3434.`;
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
      return "This phone number is already linked to another CareNavigator account. Please use a different number or sign in with your email.";
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
        bloodGroup: additionalData.bloodGroup || "O+",
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
 * Register a new user with Name, Email, Mobile Number, Blood Group, and Password (Dev/Testing Flow)
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
 * Sign in using Mobile Number and Password (Dev/Testing Flow without SMS OTP).
 * Queries Firestore users collection for matching phone number to retrieve the registered Email,
 * then authenticates natively with Firebase Auth (signInWithEmailAndPassword).
 */
export const loginUserWithPhoneAndPassword = async (phoneNumber, password, countryCode = "+91") => {
  const formattedPhone = formatE164PhoneNumber(phoneNumber, countryCode);
  console.log("🚀 [Mobile Password Login] Querying Firestore for phone:", formattedPhone);

  try {
    const usersRef = collection(db, "users");
    let q = query(usersRef, where("phone", "==", formattedPhone));
    let querySnapshot = await getDocs(q);

    // Fallback query for unformatted phone numbers
    if (querySnapshot.empty && phoneNumber.trim() !== formattedPhone) {
      q = query(usersRef, where("phone", "==", phoneNumber.trim()));
      querySnapshot = await getDocs(q);
    }

    if (querySnapshot.empty) {
      throw new Error("auth/user-not-found-phone");
    }

    const userDocData = querySnapshot.docs[0].data();
    const registeredEmail = userDocData.email;

    if (!registeredEmail) {
      throw new Error("No registered email address found for this mobile number.");
    }

    console.log("✅ [Mobile Password Login] Found email:", registeredEmail, "- Authenticating via Firebase Auth...");
    const userCredential = await signInWithEmailAndPassword(auth, registeredEmail, password);
    console.log("✅ [Mobile Password Login] SUCCESS for UID:", userCredential.user?.uid);

    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.message === "auth/user-not-found-phone") {
      throw new Error("No CareNavigator account registered with this mobile number. Please check your number or register.");
    }
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

// Module-level singleton reference for RecaptchaVerifier (preserved for future SMS OTP deployment)
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
