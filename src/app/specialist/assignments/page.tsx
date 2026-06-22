"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpModal } from "@/components/shared/HelpModal";
import { getAllAssignments, reviewAssignment } from "@/lib/firestore/assignments";
import type { Assignment } from "@/types";

const statusLabel: Record<Assignment["status"], string> = {
  pending: "Gözləyir",
  submitted: "Yoxlanılmalı",
  reviewed: "Qiymətləndirildi",
};

export default function SpecialistAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [feedback, setFeedback] = useState<Record<string, { text: string; score: string }>>({});

  async function refresh() {
    const data = await getAllAssignments();
    setAssignments(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleReview(id: string) {
    const draft = feedback[id];
    if (!draft?.text || !draft?.score) return;
    await reviewAssignment(id, {
      specialistFeedback: draft.text,
      score: Number(draft.score),
    });
    refresh();
  }

  const submitted = assignments.filter((a) => a.status === "submitted");
  const others = assignments.filter((a) => a.status !== "submitted");

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tapşırıqları yoxla</h1>
          <p className="mt-1 text-sm text-slate-500">Valideynlər tərəfindən göndərilən tapşırıqlar</p>
        </div>
        <HelpModal title="Tapşırıqları necə qiymətləndirməli?">
          <p>
            "Yoxlanılmalı" siyahısında valideynin göndərdiyi video/şəkil/qeyd görünür. Bunlara
            baxıb, <strong>rəy (yazılı feedback)</strong> və <strong>0-100 arası bal</strong> verin.
          </p>
          <p>
            Rəy yazarkən konkret olun — valideyn bunu evdə necə davam etdirəcəyini bilməlidir.
            Məsələn: "Göz təması məşqi yaxşı gedir, davam edin, indi 5 saniyəyə qədər artırmağa
            çalışın."
          </p>
          <p className="text-xs text-slate-500">
            "Göndər" basdıqdan sonra tapşırıq "Qiymətləndirildi" statusuna keçir və valideyn öz
            panelində rəyi görəcək.
          </p>
        </HelpModal>
      </div>

      <div className="mt-6 space-y-4">
        {submitted.length === 0 && (
          <p className="text-sm text-slate-400">Yoxlanılmalı tapşırıq yoxdur.</p>
        )}
        {submitted.map((a) => {
          const draft = feedback[a.id] ?? { text: "", score: "" };
          return (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-800">Tapşırıq #{a.id.slice(0, 6)}</p>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {statusLabel[a.status]}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {a.parentVideoUrl && (
                  <p>
                    Video:{" "}
                    <a href={a.parentVideoUrl} target="_blank" className="text-indigo-600 underline">
                      bax
                    </a>
                  </p>
                )}
                {a.parentImageUrl && (
                  <p>
                    Şəkil:{" "}
                    <a href={a.parentImageUrl} target="_blank" className="text-indigo-600 underline">
                      bax
                    </a>
                  </p>
                )}
                {a.parentNote && <p>Qeyd: {a.parentNote}</p>}
              </div>

              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Rəy yazın..."
                  value={draft.text}
                  onChange={(e) =>
                    setFeedback((p) => ({ ...p, [a.id]: { ...draft, text: e.target.value } }))
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Bal"
                  value={draft.score}
                  onChange={(e) =>
                    setFeedback((p) => ({ ...p, [a.id]: { ...draft, score: e.target.value } }))
                  }
                  className="w-24"
                />
                <Button onClick={() => handleReview(a.id)}>Göndər</Button>
              </div>
            </Card>
          );
        })}

        {others.length > 0 && (
          <>
            <p className="mt-6 text-sm font-medium text-slate-700">Digər tapşırıqlar</p>
            {others.map((a) => (
              <Card key={a.id} className="text-sm text-slate-500">
                Tapşırıq #{a.id.slice(0, 6)} — {statusLabel[a.status]}
                {a.score !== undefined && ` · Bal: ${a.score}`}
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
