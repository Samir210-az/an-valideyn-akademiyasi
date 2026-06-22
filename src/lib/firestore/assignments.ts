import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Assignment } from "@/types";

export async function getAssignmentsByChild(childId: string): Promise<Assignment[]> {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, "assignments"), where("childId", "==", childId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
}

export async function submitAssignment(
  assignmentId: string,
  data: Partial<Pick<Assignment, "parentVideoUrl" | "parentImageUrl" | "parentNote">>
) {
  if (!db) return;
  await updateDoc(doc(db, "assignments", assignmentId), {
    ...data,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  });
}

export async function createAssignmentForLesson(lessonId: string, childId: string) {
  if (!db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const ref = doc(collection(db, "assignments"));
  await setDoc(ref, {
    lessonId,
    childId,
    status: "pending",
  });
  return ref.id;
}
