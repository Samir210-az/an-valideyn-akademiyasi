"use client";

import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase/client";

/**
 * Brauzerdən FCM token alır (push notification icazəsi ilə birlikdə).
 * Token Firestore-da users/{uid}.fcmToken sahəsində saxlanılmalıdır.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const messaging = getMessaging(firebaseApp);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error("FCM token alınmadı:", error);
    return null;
  }
}

export async function listenForMessages(callback: (payload: unknown) => void) {
  if (typeof window === "undefined") return;
  const supported = await isSupported();
  if (!supported) return;

  const messaging = getMessaging(firebaseApp);
  onMessage(messaging, callback);
}
