import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { PackageTier } from "@/types";

export interface SubscriptionDoc {
  parentId: string;
  tier: PackageTier;
  status: "active" | "inactive" | "pending";
  startedAt?: string;
  expiresAt?: string;
  source?: "payriff" | "manual_admin";
}

export async function getSubscription(parentId: string): Promise<SubscriptionDoc | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "subscriptions", parentId));
  return snap.exists() ? (snap.data() as SubscriptionDoc) : null;
}

/**
 * Admin tərəfindən manual (ödəniş sistemini keçərək) abunəlik aktivləşdirilməsi.
 * Yalnız admin rolu Firestore qaydalarına əsasən bu kolleksiyaya yaza bilər.
 * Real kart ödənişi inteqrasiyası (Payriff) hazır olana qədər keçid həlli kimi istifadə olunur.
 */
export async function setSubscriptionManual(parentId: string, tier: PackageTier) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  await setDoc(
    doc(db, "subscriptions", parentId),
    {
      parentId,
      tier,
      status: "active",
      startedAt: serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
      source: "manual_admin",
    },
    { merge: true }
  );
}

export async function deactivateSubscription(parentId: string) {
  if (!db) return;
  await setDoc(doc(db, "subscriptions", parentId), { status: "inactive" }, { merge: true });
}
