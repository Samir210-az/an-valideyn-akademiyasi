import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
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
