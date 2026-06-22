"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getModules, getLessonsByModule } from "@/lib/firestore/modules";
import type { Module, Lesson } from "@/types";

export default function ParentCoursesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});

  useEffect(() => {
    getModules().then(setModules);
  }, []);

  async function toggleModule(id: string) {
    if (openModuleId === id) {
      setOpenModuleId(null);
      return;
    }
    setOpenModuleId(id);
    if (!lessonsByModule[id]) {
      const lessons = await getLessonsByModule(id);
      setLessonsByModule((prev) => ({ ...prev, [id]: lessons }));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Kurslar</h1>
      <p className="mt-1 text-sm text-slate-500">12 həftəlik proqramın bütün modulları</p>

      <div className="mt-6 space-y-3">
        {modules.map((m) => (
          <Card key={m.id}>
            <button
              onClick={() => toggleModule(m.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-medium text-slate-900">
                Modul {m.order}: {m.title}
              </span>
              <span className="text-sm text-slate-400">
                {openModuleId === m.id ? "Bağla" : "Aç"}
              </span>
            </button>

            {openModuleId === m.id && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {(lessonsByModule[m.id] ?? []).length === 0 ? (
                  <p className="text-sm text-slate-400">Bu modulda hələ dərs yoxdur.</p>
                ) : (
                  lessonsByModule[m.id].map((l) => (
                    <div key={l.id} className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
                      <p className="font-medium text-slate-800">{l.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {[l.videoUrl && "Video", l.pdfUrl && "PDF", l.articleContent && "Məqalə", l.quizId && "Quiz"]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
