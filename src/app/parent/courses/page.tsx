"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpModal } from "@/components/shared/HelpModal";
import { getModules, getLessonsByModule } from "@/lib/firestore/modules";
import type { Module, Lesson } from "@/types";

export default function ParentCoursesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  useEffect(() => {
    getModules().then(setModules);
  }, []);

  async function toggleModule(id: string) {
    if (openModuleId === id) {
      setOpenModuleId(null);
      return;
    }
    setOpenModuleId(id);
    setOpenLessonId(null);
    if (!lessonsByModule[id]) {
      const lessons = await getLessonsByModule(id);
      setLessonsByModule((prev) => ({ ...prev, [id]: lessons }));
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kurslar</h1>
          <p className="mt-1 text-sm text-slate-500">12 həftəlik proqramın bütün modulları</p>
        </div>
        <HelpModal title="Kurslardan necə istifadə etməli?">
          <p>
            Hər <strong>modulun</strong> üstünə basın — açılır və içindəki dərsləri görürsünüz. Bir
            dərsin üstünə basıb <strong>"Oxu"</strong> deyəndə, tam mətn və şəkil görünəcək.
          </p>
          <p>
            Modulları sırayla (1-dən 12-yə) keçməyiniz tövsiyə olunur — hər modul əvvəlkinin
            üzərində qurulur. Həftədə 1 modul tempi ilə getsəniz, 12 həftəyə tamamlayarsınız.
          </p>
          <p className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
            💡 Hər dərsdə konkret, evdə dərhal tətbiq edə biləcəyiniz addımlar var. Oxuduqdan sonra
            "Gündəlik" bölməsində nəticələri qeyd etsəniz, irəliləyişi izləyə bilərsiniz.
          </p>
        </HelpModal>
      </div>

      <div className="mt-6 space-y-3">
        {modules.map((m) => (
          <Card key={m.id}>
            <button
              onClick={() => toggleModule(m.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <span className="font-medium text-slate-900">
                  Modul {m.order}: {m.title}
                </span>
                {m.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
                )}
              </div>
              <span className="ml-3 shrink-0 text-sm text-slate-400">
                {openModuleId === m.id ? "Bağla" : "Aç"}
              </span>
            </button>

            {openModuleId === m.id && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {(lessonsByModule[m.id] ?? []).length === 0 ? (
                  <p className="text-sm text-slate-400">Bu modulda hələ dərs yoxdur.</p>
                ) : (
                  lessonsByModule[m.id].map((l) => {
                    const isOpen = openLessonId === l.id;
                    return (
                      <div key={l.id} className="overflow-hidden rounded-lg bg-slate-50">
                        <button
                          onClick={() => setOpenLessonId(isOpen ? null : l.id)}
                          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm"
                        >
                          <span className="font-medium text-slate-800">{l.title}</span>
                          <span className="ml-3 shrink-0 text-xs text-indigo-600">
                            {isOpen ? "Bağla" : "Oxu"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="space-y-4 border-t border-slate-200 bg-white px-3 py-4">
                            {l.imageUrl && (
                              <div className="relative h-44 w-full overflow-hidden rounded-xl sm:h-56">
                                <Image
                                  src={l.imageUrl}
                                  alt={l.title}
                                  fill
                                  className="object-cover"
                                  unoptimized={l.imageUrl.endsWith(".svg")}
                                />
                              </div>
                            )}

                            {l.videoUrl && (
                              <a
                                href={l.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                              >
                                ▶ Videoya bax
                              </a>
                            )}

                            {l.articleContent && (
                              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                                {l.articleContent.split(/\n\n+/).map((para, idx) => (
                                  <p key={idx} className="whitespace-pre-line">
                                    {para}
                                  </p>
                                ))}
                              </div>
                            )}

                            {l.pdfUrl && (
                              <a
                                href={l.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                              >
                                📄 PDF sənədinə bax
                              </a>
                            )}

                            {!l.imageUrl && !l.videoUrl && !l.articleContent && !l.pdfUrl && (
                              <p className="text-sm text-slate-400">Bu dərsə hələ məzmun əlavə olunmayıb.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
