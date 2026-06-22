"use client";

import { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getChildrenByParent } from "@/lib/firestore/children";
import { getDiaryEntries, upsertDiaryEntry } from "@/lib/firestore/diary";
import type { Child, DiaryEntry } from "@/types";

const FIELDS: { key: keyof DiaryEntry; label: string }[] = [
  { key: "sleepQuality", label: "Yuxu keyfiyyəti" },
  { key: "nutrition", label: "Qidalanma" },
  { key: "aggressionLevel", label: "Aqressiya səviyyəsi" },
  { key: "communicationLevel", label: "Ünsiyyət" },
  { key: "taskCompletion", label: "Tapşırıq icrası" },
];

export default function ParentDiaryPage() {
  const { appUser } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [form, setForm] = useState<Record<string, number>>({
    sleepQuality: 3,
    nutrition: 3,
    aggressionLevel: 3,
    communicationLevel: 3,
    taskCompletion: 3,
  });
  const [meltdownCount, setMeltdownCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!appUser) return;
    getChildrenByParent(appUser.uid).then((children) => {
      const first = children[0] ?? null;
      setChild(first);
      if (first) getDiaryEntries(first.id).then(setEntries);
    });
  }, [appUser]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!child) return;
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    await upsertDiaryEntry({
      childId: child.id,
      date: today,
      sleepQuality: form.sleepQuality as DiaryEntry["sleepQuality"],
      nutrition: form.nutrition as DiaryEntry["nutrition"],
      aggressionLevel: form.aggressionLevel as DiaryEntry["aggressionLevel"],
      meltdownCount,
      communicationLevel: form.communicationLevel as DiaryEntry["communicationLevel"],
      taskCompletion: form.taskCompletion as DiaryEntry["taskCompletion"],
      notes,
    });
    setSaving(false);
    setSaved(true);
    getDiaryEntries(child.id).then(setEntries);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!child) {
    return <p className="text-sm text-slate-500">Əvvəlcə Dashboard-dan uşaq profili əlavə edin.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Gündəlik</h1>
      <p className="mt-1 text-sm text-slate-500">
        Hər gün {child.name} üçün qısa qeydlər doldurun (1 = aşağı, 5 = yüksək)
      </p>

      <Card className="mt-6 max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <Label>{f.label}: {form[f.key as string]}</Label>
              <input
                type="range"
                min={1}
                max={5}
                value={form[f.key as string]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [f.key as string]: Number(e.target.value) }))
                }
                className="w-full"
              />
            </div>
          ))}

          <div>
            <Label>Meltdown sayı (bu gün)</Label>
            <input
              type="number"
              min={0}
              value={meltdownCount}
              onChange={(e) => setMeltdownCount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <Label>Qeydlər</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          {saved && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Bugünkü qeyd yadda saxlanıldı.
            </p>
          )}

          <Button type="submit" loading={saving} className="w-full">
            Bugünkü qeydi yadda saxla
          </Button>
        </form>
      </Card>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-slate-700">Son qeydlər</h2>
        <div className="mt-2 space-y-2">
          {entries.slice(0, 7).map((e) => (
            <Card key={e.id} className="text-sm">
              <p className="font-medium text-slate-800">{e.date}</p>
              <p className="mt-1 text-slate-500">
                Yuxu: {e.sleepQuality} · Qidalanma: {e.nutrition} · Aqressiya: {e.aggressionLevel} ·
                {" "}Meltdown: {e.meltdownCount} · Ünsiyyət: {e.communicationLevel}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
