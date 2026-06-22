import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import type { UserRole } from "@/types";

export async function registerUser(params: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}) {
  if (!auth || !db) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const { email, password, fullName, role, phone } = params;

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    fullName,
    role,
    phone: phone ?? null,
    avatarUrl: null,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser(email: string, password: string) {
  if (!auth) throw new Error("Firebase konfiqurasiyası tamamlanmayıb.");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function mapAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Bu email artıq qeydiyyatdan keçib.",
    "auth/invalid-email": "Email düzgün formatda deyil.",
    "auth/weak-password": "Şifrə ən azı 6 simvol olmalıdır.",
    "auth/user-not-found": "Bu email ilə istifadəçi tapılmadı.",
    "auth/wrong-password": "Şifrə yanlışdır.",
    "auth/invalid-credential": "Email və ya şifrə yanlışdır.",
    "auth/too-many-requests": "Çox sayda cəhd edildi. Bir az sonra yenidən cəhd edin.",
  };
  return map[code] ?? "Xəta baş verdi. Yenidən cəhd edin.";
}
