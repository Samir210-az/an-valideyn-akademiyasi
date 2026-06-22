// Firebase Cloud Messaging Service Worker
// Bu fayl arxa planda (tab bağlı olanda belə) push bildirişləri qəbul etmək üçündür.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// QEYD: Bu dəyərləri öz Firebase layihənizin konfiqurasiyası ilə əvəz edin.
// (NEXT_PUBLIC_FIREBASE_* env dəyişənləri build zamanı service worker-ə ötürülmür,
// ona görə bu sabitlər mənuel doldurulmalıdır və ya build script-i ilə inject edilməlidir.)
firebase.initializeApp({
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_FIREBASE_PROJECT_ID",
  storageBucket: "REPLACE_WITH_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "AN Valideyn Akademiyası", {
    body: body || "Yeni bildiriş",
    icon: "/icon-192.png",
  });
});
