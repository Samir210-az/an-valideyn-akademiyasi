"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getChildrenByParent } from "@/lib/firestore/children";
import { getDiaryEntries } from "@/lib/firestore/diary";
import type { Child, DiaryEntry } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ParentProgressPage() {
  const { appUser } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) return;
    getChildrenByParent(appUser.uid).then((children) => {
      const first = children[0] ?? null;
      setChild(first);
      if (first) getDiaryEntries(first.id).then((data) => setEntries(data.slice(0, 14).reverse()));
    });
  }, [appUser]);

  async function handleGenerateSummary() {
    if (!child) return;
    setAiLoading(true);
    setAiError(null);
    setAiSummary(null);
    try {
      const res = await fetch("/api/ai/weekly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: child.name, diaryEntries: entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xəta baş verdi.");
      setAiSummary(data.summary);
    } catch (err) {
      setAiError((err as Error).message);
    } finally {
      setAiLoading(false);
    }
  }

  if (!child) {
    return <p className="text-sm text-slate-500">Əvvəlcə Dashboard-dan uşaq profili əlavə edin.</p>;
  }

  const chartData = entries.map((e) => ({
    date: e.date.slice(5),
    Ünsiyyət: e.communicationLevel,
    Aqressiya: e.aggressionLevel,
    "Tapşırıq icrası": e.taskCompletion,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">İnkişaf izləmə</h1>
      <p className="mt-1 text-sm text-slate-500">{child.name} üçün son 14 günün dinamikası</p>

      <Card className="mt-6">
        <p className="mb-4 text-sm font-medium text-slate-700">Ünsiyyət / Aqressiya / Tapşırıq icrası</p>
        {chartData.length === 0 ? (
          <p className="text-sm text-slate-400">
            Hələ kifayət qədər gündəlik qeyd yoxdur. Gündəlik bölməsindən qeyd əlavə edin.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="Ünsiyyət" stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="Aqressiya" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Tapşırıq icrası" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">AI Həftəlik Xülasə</p>
          <Button variant="outline" loading={aiLoading} onClick={handleGenerateSummary}>
            Xülasə hazırla
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          AI yalnız sizin daxil etdiyiniz gündəlik qeydlərə əsaslanır və diaqnoz qoymur.
        </p>
        {aiError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{aiError}</p>
        )}
        {aiSummary && (
          <p className="mt-3 whitespace-pre-line rounded-lg bg-indigo-50 px-3 py-2.5 text-sm text-indigo-800">
            {aiSummary}
          </p>
        )}
      </Card>

      <Card className="mt-6">
        <p className="text-sm font-medium text-slate-700">Hədəflər</p>
        <p className="mt-2 text-sm text-slate-400">
          Bacarıq/davranış/sensor hədəfləri mütəxəssis tərəfindən təyin olunduqda burada
          progress dairələri şəklində göstəriləcək.
        </p>
      </Card>
    </div>
  );
}
