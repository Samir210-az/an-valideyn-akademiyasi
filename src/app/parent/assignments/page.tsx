"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { getChildrenByParent } from "@/lib/firestore/children";
import { getAssignmentsByChild, submitAssignment } from "@/lib/firestore/assignments";
import type { Child, Assignment } from "@/types";

const statusLabel: Record<Assignment["status"], string> = {
  pending: "Gözləyir",
  submitted: "Göndərildi",
  reviewed: "Qiymətləndirildi",
};

export default function ParentAssignmentsPage() {
  const { appUser } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { video: string; image: string; note: string }>>({});

  useEffect(() => {
    if (!appUser) return;
    getChildrenByParent(appUser.uid).then((children) => {
      const first = children[0] ?? null;
      setChild(first);
      if (first) getAssignmentsByChild(first.id).then(setAssignments);
    });
  }, [appUser]);

  async function handleSubmit(assignmentId: string) {
    const draft = drafts[assignmentId] ?? { video: "", image: "", note: "" };
    await submitAssignment(assignmentId, {
      parentVideoUrl: draft.video || undefined,
      parentImageUrl: draft.image || undefined,
      parentNote: draft.note || undefined,
    });
    if (child) getAssignmentsByChild(child.id).then(setAssignments);
  }

  if (!child) {
    return <p className="text-sm text-slate-500">Əvvəlcə Dashboard-dan uşaq profili əlavə edin.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Tapşırıqlar</h1>
      <p className="mt-1 text-sm text-slate-500">
        Mütəxəssis tərəfindən təyin olunmuş ev tapşırıqları
      </p>

      <div className="mt-6 space-y-4">
        {assignments.length === 0 && (
          <p className="text-sm text-slate-400">Hələ tapşırıq təyin olunmayıb.</p>
        )}

        {assignments.map((a) => {
          const draft = drafts[a.id] ?? { video: "", image: "", note: "" };
          return (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-800">Tapşırıq #{a.id.slice(0, 6)}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {statusLabel[a.status]}
                </span>
              </div>

              {a.status === "pending" && (
                <div className="mt-4 space-y-2">
                  <Input
                    placeholder="Video linki (URL)"
                    value={draft.video}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [a.id]: { ...draft, video: e.target.value } }))
                    }
                  />
                  <Input
                    placeholder="Şəkil linki (URL)"
                    value={draft.image}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [a.id]: { ...draft, image: e.target.value } }))
                    }
                  />
                  <textarea
                    placeholder="Qeyd"
                    value={draft.note}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [a.id]: { ...draft, note: e.target.value } }))
                    }
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                  <Button onClick={() => handleSubmit(a.id)}>Göndər</Button>
                </div>
              )}

              {a.status !== "pending" && a.specialistFeedback && (
                <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                  Mütəxəssis rəyi: {a.specialistFeedback}
                  {a.score !== undefined && ` (Bal: ${a.score})`}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
