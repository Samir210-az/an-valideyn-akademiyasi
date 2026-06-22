"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { registerUser, mapAuthError } from "@/lib/auth-helpers";

// Qeydiyyat səhifəsi default olaraq "valideyn" rolu üçündür.
// Admin və mütəxəssis hesabları Admin Paneli vasitəsilə yaradılır (təhlükəsizlik üçün).
export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir.");
      return;
    }
    if (password.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, password, fullName, role: "parent", phone });
      router.push("/parent/dashboard");
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Qeydiyyatdan keçin</h1>
          <p className="mt-1 text-sm text-slate-500">
            Valideyn hesabı yaradın və uşağınız üçün proqrama başlayın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Ad və Soyad</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aynur Məmmədova"
            />
          </div>

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
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+994 50 123 45 67"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <Label htmlFor="confirmPassword">Şifrə (təkrar)</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Hesab yarat
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Artıq hesabınız var?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Daxil olun
          </Link>
        </p>
      </Card>
    </div>
  );
}
