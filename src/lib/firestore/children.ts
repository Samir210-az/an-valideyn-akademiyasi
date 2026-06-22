import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Child } from "@/types";

export async function getChildrenByParent(parentId: string): Promise<Child[]> {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, "children"), where("parentId", "==", parentId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Child));
}

export async function createChild(data: Omit<Child, "id" | "createdAt">) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const ref = doc(collection(db, "children"));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}
