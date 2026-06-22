"use client";

import { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getModules,
  getLessonsByModule,
  createLesson,
} from "@/lib/firestore/modules";
import type { Module, Lesson } from "@/types";

export default function SpecialistLessonsPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [pdf, setPdf] = useState("");
  const [article, setArticle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getModules().then((m) => {
      setModules(m);
      if (m[0]) setSelectedModuleId(m[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedModuleId) getLessonsByModule(selectedModuleId).then(setLessons);
  }, [selectedModuleId]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!selectedModuleId || !title.trim()) return;
    setSaving(true);
    await createLesson({
      moduleId: selectedModuleId,
      title,
      videoUrl: video || undefined,
      pdfUrl: pdf || undefined,
      articleContent: article || undefined,
      order: lessons.length + 1,
    });
    setTitle("");
    setVideo("");
    setPdf("");
    setArticle("");
    setSaving(false);
    setSaved(true);
    getLessonsByModule(selectedModuleId).then(setLessons);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dərs yaratma</h1>
      <p className="mt-1 text-sm text-slate-500">
        Mövcud modullara yeni dərs (video, PDF, məqalə) əlavə edin
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="module">Modul</Label>
              <select
                id="module"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.order}. {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="title">Dərs adı</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="video">Video linki</Label>
              <Input id="video" value={video} onChange={(e) => setVideo(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pdf">PDF linki</Label>
              <Input id="pdf" value={pdf} onChange={(e) => setPdf(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="article">Məqalə mətni</Label>
              <textarea
                id="article"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            {saved && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Dərs uğurla əlavə olundu.
              </p>
            )}

            <Button type="submit" loading={saving} className="w-full">
              Dərs yarat
            </Button>
          </form>
        </Card>

        <Card>
          <p className="font-medium text-slate-900">Bu moduldakı dərslər</p>
          <div className="mt-3 space-y-2">
            {lessons.length === 0 && <p className="text-sm text-slate-400">Hələ dərs yoxdur.</p>}
            {lessons.map((l) => (
              <div key={l.id} className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                {l.order}. {l.title}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
