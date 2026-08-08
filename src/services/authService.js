import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

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
 * Register a new user with Email, Password, and Display Name
 */
export const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save displayName using Firebase updateProfile
    if (name && name.trim() !== "") {
      await updateProfile(user, { displayName: name });
    }

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
