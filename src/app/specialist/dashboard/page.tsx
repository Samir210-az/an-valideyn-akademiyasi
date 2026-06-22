"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { getAllAssignments } from "@/lib/firestore/assignments";
import { getUsersByRole } from "@/lib/firestore/users";
import { getChildrenByParent } from "@/lib/firestore/children";
import { getDiaryEntries } from "@/lib/firestore/diary";
import { getAssignmentsByChild } from "@/lib/firestore/assignments";
import type { Assignment, AppUser, Child } from "@/types";

export default function SpecialistDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [parents, setParents] = useState<AppUser[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  const [report, setReport] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    getAllAssignments().then(setAssignments);
    getUsersByRole("parent").then(async (list) => {
      setParents(list);
      const allChildren = (
        await Promise.all(list.map((p) => getChildrenByParent(p.uid)))
      ).flat();
      setChildren(allChildren);
      if (allChildren[0]) setSelectedChildId(allChildren[0].id);
    });
  }, []);

  const pending = assignments.filter((a) => a.status === "submitted").length;
  const reviewed = assignments.filter((a) => a.status === "reviewed").length;

  async function handleGenerateReport() {
    const child = children.find((c) => c.id === selectedChildId);
    if (!child) return;
    setReportLoading(true);
    setReportError(null);
    setReport(null);
    try {
      const [diaryEntries, childAssignments] = await Promise.all([
        getDiaryEntries(child.id),
        getAssignmentsByChild(child.id),
      ]);
      const res = await fetch("/api/ai/specialist-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: child.name,
          diaryEntries: diaryEntries.slice(0, 14),
          assignments: childAssignments,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xəta baş verdi.");
      setReport(data.report);
    } catch (err) {
      setReportError((err as Error).message);
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Mütəxəssis Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Yoxlanılmamış tapşırıqlar və ümumi icmal</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Yoxlanılmamış tapşırıq</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pending}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Qiymətləndirilmiş</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{reviewed}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Aktiv valideynlər</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{parents.length}</p>
        </Card>
      </div>

      <Card className="mt-6">
        <p className="font-medium text-slate-900">AI Hesabat Layihəsi</p>
        <p className="mt-1 text-sm text-slate-500">
          Uşaq seçin və AI son gündəlik qeydlər + tapşırıq nəticələri əsasında hesabat layihəsi
          hazırlasın. Son qərarı və redaktəni siz aparırsınız.
        </p>

        <div className="mt-4 flex gap-2">
          <Select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
            {children.length === 0 && <option value="">Uşaq tapılmadı</option>}
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Button onClick={handleGenerateReport} loading={reportLoading} disabled={!selectedChildId}>
            Hesabat hazırla
          </Button>
        </div>

        {reportError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{reportError}</p>
        )}
        {report && (
          <p className="mt-4 whitespace-pre-line rounded-lg bg-indigo-50 px-3.5 py-3 text-sm text-indigo-800">
            {report}
          </p>
        )}
      </Card>
    </div>
  );
}
