import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Module, Lesson } from "@/types";

const MODULES_COL = "modules";
const LESSONS_COL = "lessons";

export async function getModules(): Promise<Module[]> {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, MODULES_COL), orderBy("order")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Module));
}

export async function createModule(data: Omit<Module, "id">) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const ref = doc(collection(db, MODULES_COL));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function deleteModule(moduleId: string) {
  if (!db) return;
  await deleteDoc(doc(db, MODULES_COL, moduleId));
}

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, LESSONS_COL), orderBy("order"))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Lesson))
    .filter((l) => l.moduleId === moduleId);
}

export async function createLesson(data: Omit<Lesson, "id">) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const ref = doc(collection(db, LESSONS_COL));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function deleteLesson(lessonId: string) {
  if (!db) return;
  await deleteDoc(doc(db, LESSONS_COL, lessonId));
}
