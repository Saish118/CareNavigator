import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  createUserDocument,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase authentication state changes across refreshes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await createUserDocument(user);
          setUserProfile(profile);
        } catch (err) {
          console.warn("⚠️ [AuthContext] Document profile load fallback:", err.message);
          const fallback = await getUserProfile(user.uid);
          setUserProfile(fallback);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin =
    currentUser?.email?.toLowerCase() === "saishjoshi2004@gmail.com" ||
    userProfile?.role === "admin";

  const value = {
    currentUser,
    user: currentUser,
    userProfile,
    isAdmin,
    loading,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser,
    refreshProfile: async () => {
      if (currentUser) {
        const p = await getUserProfile(currentUser.uid);
        setUserProfile(p);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
