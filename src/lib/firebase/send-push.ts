import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

function getAdminAppInstance(): App {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY tapılmadı.");
  return initializeApp({ credential: cert(JSON.parse(raw)) });
}

/**
 * Tək bir istifadəçiyə (FCM token-i ilə) push bildiriş göndərir.
 */
export async function sendPushToToken(token: string, title: string, body: string) {
  const app = getAdminAppInstance();
  const messaging = getMessaging(app);
  return messaging.send({
    token,
    notification: { title, body },
  });
}

/**
 * Bir neçə token-ə eyni anda bildiriş göndərir (multicast).
 */
export async function sendPushToTokens(tokens: string[], title: string, body: string) {
  if (tokens.length === 0) return { successCount: 0, failureCount: 0 };
  const app = getAdminAppInstance();
  const messaging = getMessaging(app);
  return messaging.sendEachForMulticast({
    tokens,
    notification: { title, body },
  });
}
