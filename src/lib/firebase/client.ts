import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase konfiqurasiyası .env.local faylından oxunur.
// Dəyərləri Firebase Console > Project Settings > General > Your apps bölməsindən götürün.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp =
  getApps().length ? getApp() : initializeApp(firebaseConfig);

// API key yoxdursa (məs. build zamanı .env.local hələ doldurulmayıb),
// auth/db/storage instansiyalarını yaratmağa cəhd etməyək ki, build sınmasın.
const hasValidConfig = Boolean(firebaseConfig.apiKey);

export const auth = hasValidConfig ? getAuth(firebaseApp) : (null as unknown as ReturnType<typeof getAuth>);
export const db = hasValidConfig ? getFirestore(firebaseApp) : (null as unknown as ReturnType<typeof getFirestore>);
export const storage = hasValidConfig ? getStorage(firebaseApp) : (null as unknown as ReturnType<typeof getStorage>);
