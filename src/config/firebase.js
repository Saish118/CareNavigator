import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAzqB6PShzvOqbJ-4vXBubXQ_elATbQpZc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "carenavigator-414e7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "carenavigator-414e7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "carenavigator-414e7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "262006437357",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:262006437357:web:b6f4432622857e605ae3e4",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
