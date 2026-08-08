import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * Diagnostic logger to verify Firebase config load state
 */
console.log("🔥 [Firebase Auth] Initializing authService.js...");
console.log("🔥 [Firebase Auth] Loaded Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("🔥 [Firebase Auth] Loaded API Key Prefix:", import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 8) + "...");
console.log("🔥 [Firebase Auth] Auth instance state:", auth ? "INITIALIZED ✅" : "MISSING ❌");

/**
 * User-friendly Firebase authentication error code translator
 */
const getFriendlyErrorMessage = (error) => {
  const errorCode = error?.code || "";
  console.error("❌ [Firebase Auth Error Object]:", error);
  console.error("❌ [Firebase Auth Error Code]:", errorCode);
  console.error("❌ [Firebase Auth Error Message]:", error?.message);

  switch (errorCode) {
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is disabled in your Firebase Console. Please go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.";
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
 * Requirement 2, 3, 4, 5, 7, 8:
 * Automatically create a document in the "users" collection for a user
 * using user.uid as Document ID. Does not overwrite if document already exists.
 */
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user || !user.uid) {
    console.warn("⚠️ [Firestore] createUserDocument called with invalid user object:", user);
    return null;
  }

  console.log("📄 [Firestore] Attempting to create user document for UID:", user.uid);
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || "",
        email: user.email || "",
        phone: additionalData.phone || user.phoneNumber || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("📄 [Firestore] Document does not exist. Writing userData:", userData);
      await setDoc(userRef, userData);
      console.log("✅ [Firestore] User document successfully written to Firestore 'users' collection!");
      return userData;
    } else {
      console.log("ℹ️ [Firestore] User document already exists for UID:", user.uid);
      return userSnap.data();
    }
  } catch (error) {
    console.error("❌ [Firestore Error] Failed writing user document:", error);
    console.error("❌ [Firestore Error Code]:", error.code);
    console.error("❌ [Firestore Error Message]:", error.message);
    return null;
  }
};

/**
 * Register a new user with Email, Password, and Display Name
 */
export const registerUser = async (name, email, password, phone = "") => {
  console.log("🚀 [registerUser] Function invoked with parameters:");
  console.log("🚀 [registerUser] Name:", name);
  console.log("🚀 [registerUser] Email:", email);
  console.log("🚀 [registerUser] Password length:", password ? password.length : 0);

  try {
    console.log("⏳ [Firebase Auth] Calling createUserWithEmailAndPassword()...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ [Firebase Auth] createUserWithEmailAndPassword SUCCESSFUL!");
    console.log("✅ [Firebase Auth] Created User UID:", userCredential.user?.uid);
    console.log("✅ [Firebase Auth] Created User Email:", userCredential.user?.email);

    const user = userCredential.user;

    if (name && name.trim() !== "") {
      console.log("⏳ [Firebase Auth] Updating displayName via updateProfile()...");
      await updateProfile(user, { displayName: name });
      console.log("✅ [Firebase Auth] updateProfile SUCCESSFUL!");
    }

    console.log("⏳ [Firestore] Triggering createUserDocument()...");
    await createUserDocument(user, { name, phone });

    return { success: true, user };
  } catch (error) {
    console.error("💥 [registerUser Catch Block Triggered!]");
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

    await createUserDocument(userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("💥 [loginUser Catch Block Triggered!]");
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
