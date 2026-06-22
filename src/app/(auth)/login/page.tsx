"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { loginUser, mapAuthError } from "@/lib/auth-helpers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppUser } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(email, password);

      let role: AppUser["role"] = "parent";
      if (db) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          role = (snap.data() as AppUser).role;
        }
      }

      const destinations: Record<AppUser["role"], string> = {
        admin: "/admin/dashboard",
        specialist: "/specialist/dashboard",
        parent: "/parent/dashboard",
      };
      router.push(destinations[role]);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Xoş gəlmisiniz</h1>
          <p className="mt-1 text-sm text-slate-500">
            AN Valideyn Akademiyası hesabınıza daxil olun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@nümunə.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Şifrə</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Daxil ol
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Hesabınız yoxdur?{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </Card>
    </div>
  );
}
