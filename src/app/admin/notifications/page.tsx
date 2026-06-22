"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<"all" | "parent" | "specialist">("all");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!db) return;
    setSending(true);
    await addDoc(collection(db, "broadcastNotifications"), {
      title,
      body,
      target,
      createdAt: serverTimestamp(),
    });
    setSending(false);
    setSent(true);
    setTitle("");
    setBody("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Bildiriş göndər</h1>
      <p className="mt-1 text-sm text-slate-500">
        Valideynlərə və ya mütəxəssislərə kütləvi bildiriş göndərin.
      </p>

      <Card className="mt-6 max-w-lg">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <Label htmlFor="target">Kimə göndərilsin</Label>
            <Select
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value as typeof target)}
            >
              <option value="all">Hamıya</option>
              <option value="parent">Yalnız valideynlərə</option>
              <option value="specialist">Yalnız mütəxəssislərə</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Başlıq</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="body">Mətn</Label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          {sent && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Bildiriş göndərildi.
            </p>
          )}
          <Button type="submit" loading={sending} className="w-full">
            Göndər
          </Button>
        </form>
      </Card>
    </div>
  );
}
