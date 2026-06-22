import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Server-side əməliyyatlar üçün (API routes, Cloud Functions).
// FIREBASE_SERVICE_ACCOUNT_KEY env dəyişəni JSON service account açarını saxlamalıdır.
// Lazy-init: build zamanı (env hələ doldurulmayanda) xəta verməsin deyə yalnız
// runtime-da, faktiki çağırıldıqda init olunur.

let cachedApp: App | null = null;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length) {
    cachedApp = getApps()[0];
    return cachedApp;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY tapılmadı. Server-side Firebase əməliyyatları üçün .env.local-a əlavə edin."
    );
  }

  const serviceAccount = JSON.parse(raw);
  cachedApp = initializeApp({ credential: cert(serviceAccount) });
  return cachedApp;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

// Geriyə uyğunluq üçün proxy-bənzər export (yalnız faktiki istifadə zamanı init olunur)
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getAdminDb();
    // @ts-expect-error - dynamic proxy access
    return db[prop];
  },
});
