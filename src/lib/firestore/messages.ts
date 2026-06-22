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
import type { Message } from "@/types";

export async function getConversation(userIdA: string, userIdB: string): Promise<Message[]> {
  if (!db) return [];
  // QEYD: "in" operatoru + orderBy birlikdə composite index tələb edir.
  // Sıralamayı client tərəfdə edirik ki, əlavə index lazım olmasın.
  const snap = await getDocs(
    query(collection(db, "messages"), where("senderId", "in", [userIdA, userIdB]))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Message))
    .filter(
      (m) =>
        (m.senderId === userIdA && m.receiverId === userIdB) ||
        (m.senderId === userIdB && m.receiverId === userIdA)
    )
    .sort((a, b) => {
      const aTime = (a.createdAt as unknown as { seconds?: number })?.seconds ?? 0;
      const bTime = (b.createdAt as unknown as { seconds?: number })?.seconds ?? 0;
      return aTime - bTime;
    });
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const ref = doc(collection(db, "messages"));
  await setDoc(ref, {
    senderId,
    receiverId,
    content,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
