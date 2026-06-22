import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { DiaryEntry } from "@/types";

export async function getDiaryEntries(childId: string): Promise<DiaryEntry[]> {
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, "diaryEntries"), where("childId", "==", childId), orderBy("date", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DiaryEntry));
}

export async function upsertDiaryEntry(data: Omit<DiaryEntry, "id">) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  // Hər gün üçün bir qeyd: id = childId_date
  const id = `${data.childId}_${data.date}`;
  await setDoc(doc(db, "diaryEntries", id), data, { merge: true });
  return id;
}
