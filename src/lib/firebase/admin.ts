import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Server-side əməliyyatlar üçün (API routes, Cloud Functions).
// FIREBASE_SERVICE_ACCOUNT_KEY env dəyişəni JSON service account açarını saxlamalıdır.
let adminApp: App;

if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  adminApp = initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
