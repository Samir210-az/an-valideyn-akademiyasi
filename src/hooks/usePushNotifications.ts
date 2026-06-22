"use client";

import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { requestNotificationPermission, listenForMessages } from "@/lib/firebase/messaging";
import { useAuth } from "@/context/AuthContext";

/**
 * İstifadəçi panel səhifəsinə daxil olduqda push notification icazəsi istəyir
 * və alınan FCM token-i Firestore-da users/{uid}.fcmToken sahəsinə yazır.
 */
export function usePushNotifications() {
  const { appUser } = useAuth();

  useEffect(() => {
    if (!appUser || !db) return;

    (async () => {
      const token = await requestNotificationPermission();
      if (token) {
        await updateDoc(doc(db!, "users", appUser.uid), { fcmToken: token });
      }
    })();

    listenForMessages((payload) => {
      console.log("Yeni bildiriş alındı:", payload);
    });
  }, [appUser]);
}
