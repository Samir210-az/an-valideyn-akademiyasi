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
import { DEFAULT_COURSES } from "@/lib/seed/defaultCourses";
import type { Module, Lesson } from "@/types";

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
  const [lessonImage, setLessonImage] = useState("");

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
    setLoading(true);
    const existingByTitle = new Map(modules.map((m) => [m.title.trim().toLowerCase(), m]));

    for (const course of DEFAULT_COURSES) {
      const key = course.title.trim().toLowerCase();
      const existingModule = existingByTitle.get(key);

      if (!existingModule) {
        // Modul ümumiyyətlə yoxdursa — modulu və bütün dərslərini yarat.
        const moduleId = await createModule({
          order: course.order,
          title: course.title,
          description: course.description,
        });

        for (let i = 0; i < course.lessons.length; i++) {
          const lesson = course.lessons[i];
          await createLesson({
            moduleId,
            order: i + 1,
            title: lesson.title,
            articleContent: lesson.articleContent,
            imageUrl: lesson.imageUrl,
          });
        }
        continue;
      }

      // Modul artıq varsa — YALNIZ çatışmayan dərsləri (başlığa görə) əlavə et.
      const existingLessons = await getLessonsByModule(existingModule.id);
      const existingLessonTitles = new Set(existingLessons.map((l) => l.title.trim().toLowerCase()));

      for (let i = 0; i < course.lessons.length; i++) {
        const lesson = course.lessons[i];
        if (existingLessonTitles.has(lesson.title.trim().toLowerCase())) continue;

        await createLesson({
          moduleId: existingModule.id,
          order: existingLessons.length + i + 1,
          title: lesson.title,
          articleContent: lesson.articleContent,
          imageUrl: lesson.imageUrl,
        });
      }
    }
    await refreshModules();
    alert("Default məzmun yoxlanıldı — çatışmayan modul/dərslər əlavə olundu.");
  }

  async function handleCleanupDuplicates() {
    if (!confirm("Eyni adlı təkrarlanan modullar (və onların dərsləri) silinəcək. Davam edilsin?")) return;
    setLoading(true);

    const seen = new Map<string, Module>();
    const duplicates: Module[] = [];

    // Hər modulu sırayla gəzib, eyni başlığı ƏVVƏLCƏ görmüşüksə, sonrakını "təkrar" sayırıq.
    for (const m of [...modules].sort((a, b) => a.order - b.order)) {
      const key = m.title.trim().toLowerCase();
      if (seen.has(key)) {
        duplicates.push(m);
      } else {
        seen.set(key, m);
      }
    }

    for (const dup of duplicates) {
      const dupLessons = await getLessonsByModule(dup.id);
      for (const l of dupLessons) {
        await deleteLesson(l.id);
      }
      await deleteModule(dup.id);
    }

    await refreshModules();
    alert(`${duplicates.length} təkrarlanan modul silindi.`);
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
      imageUrl: lessonImage || undefined,
      order: lessons.length + 1,
    });
    setLessonTitle("");
    setLessonVideo("");
    setLessonPdf("");
    setLessonArticle("");
    setLessonImage("");
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
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-slate-900">Modullar</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSeedDefaultModules} title="Mövcud olmayan modulları əlavə edir, təkrar yaratmır">
              Default məzmunu yarat
            </Button>
            {modules.length > 0 && (
              <Button variant="outline" onClick={handleCleanupDuplicates} className="border-red-200 text-red-600 hover:bg-red-50">
                Təkrarları təmizlə
              </Button>
            )}
          </div>
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
                      {[l.videoUrl && "Video", l.pdfUrl && "PDF", l.articleContent && "Məqalə", l.imageUrl && "Şəkil"]
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
                <Label htmlFor="lessonImage">Şəkil linki (URL, opsional)</Label>
                <Input
                  id="lessonImage"
                  value={lessonImage}
                  onChange={(e) => setLessonImage(e.target.value)}
                  placeholder="/images/lessons/autizm.svg"
                />
              </div>
              <div>
                <Label htmlFor="lessonArticle">Məqalə mətni</Label>
                <textarea
                  id="lessonArticle"
                  value={lessonArticle}
                  onChange={(e) => setLessonArticle(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
