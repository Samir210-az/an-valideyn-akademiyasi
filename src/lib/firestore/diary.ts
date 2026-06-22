import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { DiaryEntry } from "@/types";

export async function getDiaryEntries(childId: string): Promise<DiaryEntry[]> {
  if (!db) return [];
  // QEYD: orderBy + where birlikdə Firestore-da composite index tələb edir.
  // Bunun əvəzinə yalnız where ilə çəkib, tarixə görə sıralamayı burada (client tərəfdə) edirik —
  // bu, kiçik/orta həcmli kolleksiyalar üçün tam adekvatdır və əlavə index lazım deyil.
  const snap = await getDocs(query(collection(db, "diaryEntries"), where("childId", "==", childId)));
  const entries = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DiaryEntry));
  return entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function upsertDiaryEntry(data: Omit<DiaryEntry, "id">) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  // Hər gün üçün bir qeyd: id = childId_date
  const id = `${data.childId}_${data.date}`;
  await setDoc(doc(db, "diaryEntries", id), data, { merge: true });
  return id;
}
