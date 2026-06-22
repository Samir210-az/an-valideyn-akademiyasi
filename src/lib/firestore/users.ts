import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppUser, UserRole } from "@/types";

export async function getUsersByRole(role: UserRole): Promise<AppUser[]> {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, "users"), where("role", "==", role)));
  return snap.docs.map((d) => d.data() as AppUser);
}

export async function getAllUsers(): Promise<AppUser[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data() as AppUser);
}

export async function updateUserRole(uid: string, role: UserRole) {
  if (!db) return;
  await updateDoc(doc(db, "users", uid), { role });
}

/**
 * İstifadəçinin Firestore profilini silir (rola əsaslanan girişi dərhal bağlayır —
 * RoleGuard profil tapmadıqda /login-ə yönləndirir).
 * QEYD: bu, yalnız Firestore profilini silir. Firebase Authentication hesabının
 * tam silinməsi server-side (Admin SDK) tələb edir; FIREBASE_SERVICE_ACCOUNT_KEY
 * qoşulmayıbsa, bu, hələ ki, mümkün deyil — amma istifadəçi praktiki olaraq
 * sistemə giriş əldə edə bilməyəcək.
 */
export async function deleteUserProfile(uid: string) {
  if (!db) return;
  await deleteDoc(doc(db, "users", uid));
}
