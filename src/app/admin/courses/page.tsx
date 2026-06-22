"use client";

import { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getModules,
  createModule,
  deleteModule,
  getLessonsByModule,
  createLesson,
  deleteLesson,
} from "@/lib/firestore/modules";
import type { Module, Lesson } from "@/types";

const DEFAULT_MODULES = [
  "Autizmi anlamaq",
  "Davranış idarəetməsi",
  "Ünsiyyət bacarıqları",
  "Nitqin inkişafı",
  "Sensor inteqrasiya",
  "Emosional tənzimləmə",
  "Oyun terapiyası elementləri",
  "Məktəbə hazırlıq",
  "Sosial bacarıqlar",
  "DEHB strategiyaları",
  "Müstəqillik bacarıqları",
  "Uzunmüddətli inkişaf planı",
];

export default function AdminCoursesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonPdf, setLessonPdf] = useState("");
  const [lessonArticle, setLessonArticle] = useState("");

  async function refreshModules() {
    const data = await getModules();
    setModules(data);
    setLoading(false);
  }

  useEffect(() => {
    refreshModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      getLessonsByModule(selectedModule.id).then(setLessons);
    } else {
      setLessons([]);
    }
  }, [selectedModule]);

  async function handleSeedDefaultModules() {
    for (let i = 0; i < DEFAULT_MODULES.length; i++) {
      await createModule({
        order: i + 1,
        title: DEFAULT_MODULES[i],
        description: "",
      });
    }
    refreshModules();
  }

  async function handleCreateModule(e: FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createModule({
      order: modules.length + 1,
      title: newTitle,
      description: newDescription,
    });
    setNewTitle("");
    setNewDescription("");
    refreshModules();
  }

  async function handleDeleteModule(id: string) {
    await deleteModule(id);
    if (selectedModule?.id === id) setSelectedModule(null);
    refreshModules();
  }

  async function handleCreateLesson(e: FormEvent) {
    e.preventDefault();
    if (!selectedModule || !lessonTitle.trim()) return;
    await createLesson({
      moduleId: selectedModule.id,
      title: lessonTitle,
      videoUrl: lessonVideo || undefined,
      pdfUrl: lessonPdf || undefined,
      articleContent: lessonArticle || undefined,
      order: lessons.length + 1,
    });
    setLessonTitle("");
    setLessonVideo("");
    setLessonPdf("");
    setLessonArticle("");
    getLessonsByModule(selectedModule.id).then(setLessons);
  }

  async function handleDeleteLesson(id: string) {
    await deleteLesson(id);
    if (selectedModule) getLessonsByModule(selectedModule.id).then(setLessons);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Modullar siyahısı */}
      <Card className="lg:col-span-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Modullar</h2>
          {modules.length === 0 && !loading && (
            <Button variant="outline" onClick={handleSeedDefaultModules}>
              12 modulu yarat
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                selectedModule?.id === m.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>
                {m.order}. {m.title}
              </span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteModule(m.id);
                }}
                className="text-xs text-red-500 hover:underline"
              >
                Sil
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateModule} className="mt-6 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-medium text-slate-700">Yeni modul əlavə et</p>
          <Input
            placeholder="Modul adı"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            placeholder="Qısa təsvir (opsional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Button type="submit" variant="secondary" className="w-full">
            Modul yarat
          </Button>
        </form>
      </Card>

      {/* Dərslər */}
      <Card className="lg:col-span-2">
        {!selectedModule ? (
          <p className="text-sm text-slate-500">
            Dərsləri görmək və əlavə etmək üçün soldan bir modul seçin.
          </p>
        ) : (
          <>
            <h2 className="font-semibold text-slate-900">
              {selectedModule.order}. {selectedModule.title} — Dərslər
            </h2>

            <div className="mt-4 space-y-2">
              {lessons.length === 0 && (
                <p className="text-sm text-slate-400">Hələ dərs əlavə olunmayıb.</p>
              )}
              {lessons.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {l.order}. {l.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {[l.videoUrl && "Video", l.pdfUrl && "PDF", l.articleContent && "Məqalə"]
                        .filter(Boolean)
                        .join(" · ") || "Məzmun əlavə olunmayıb"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteLesson(l.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateLesson} className="mt-6 space-y-3 border-t border-slate-100 pt-4">
              <p className="text-sm font-medium text-slate-700">Yeni dərs əlavə et</p>
              <div>
                <Label htmlFor="lessonTitle">Dərs adı</Label>
                <Input
                  id="lessonTitle"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Məs. Göz təması qurmaq"
                />
              </div>
              <div>
                <Label htmlFor="lessonVideo">Video linki (URL)</Label>
                <Input
                  id="lessonVideo"
                  value={lessonVideo}
                  onChange={(e) => setLessonVideo(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="lessonPdf">PDF linki (URL)</Label>
                <Input
                  id="lessonPdf"
                  value={lessonPdf}
                  onChange={(e) => setLessonPdf(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="lessonArticle">Məqalə mətni</Label>
                <textarea
                  id="lessonArticle"
                  value={lessonArticle}
                  onChange={(e) => setLessonArticle(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Dərsin mətn izahı..."
                />
              </div>
              <Button type="submit" className="w-full">
                Dərs əlavə et
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
