import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * User-friendly Firebase authentication error code translator
 */
const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
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
      return "An unexpected authentication error occurred. Please try again.";
  }
};

/**
 * Requirement 2, 3, 4, 5, 7, 8:
 * Automatically create a document in the "users" collection for a user
 * using user.uid as Document ID. Does not overwrite if document already exists.
 */
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user || !user.uid) return null;

  // Document reference inside "users" collection with Document ID = user.uid
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);

    // Requirement 8: If document already exists, do not overwrite it
    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || "",
        email: user.email || "",
        phone: additionalData.phone || user.phoneNumber || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, userData);
      return userData;
    }

    return userSnap.data();
  } catch (error) {
    console.error("Firestore user document creation error:", error);
    // Requirement 7: Graceful error handling that preserves authentication flow
    return null;
  }
};

/**
 * Register a new user with Email, Password, and Display Name
 */
export const registerUser = async (name, email, password, phone = "") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Requirement 3: Save displayName using Firebase updateProfile
    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name });
    }

    // Requirement 2: Automatically create document inside "users" collection
    await createUserDocument(user, { name, phone });

    return { success: true, user };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    throw new Error(friendlyMessage);
  }
};

/**
 * Sign in an existing user with Email and Password
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Optionally ensure user profile document exists in Firestore without overwriting
    await createUserDocument(userCredential.user);

    return { success: true, user: userCredential.user };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    throw new Error(friendlyMessage);
  }
};

/**
 * Sign out the currently authenticated user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    throw new Error(friendlyMessage);
  }
};

/**
 * Get the currently authenticated Firebase user instance synchronously
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
