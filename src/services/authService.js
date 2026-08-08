import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
      return "Email/Password sign-in is disabled in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.";
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
 * Requirements 1, 2, 3, 4, 5, 7, 8:
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
        name: additionalData.name || user.displayName || "",
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
    
    // Throw error so caller knows Firestore creation failed
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
