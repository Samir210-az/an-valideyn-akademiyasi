"use client";

import { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpModal } from "@/components/shared/HelpModal";
import { useAuth } from "@/context/AuthContext";
import { getChildrenByParent, createChild } from "@/lib/firestore/children";
import { getAssignmentsByChild } from "@/lib/firestore/assignments";
import type { Child, Assignment } from "@/types";

export default function ParentDashboardPage() {
  const { appUser } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<Child | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddChild, setShowAddChild] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    if (!appUser) return;
    const data = await getChildrenByParent(appUser.uid);
    setChildren(data);
    setSelected((prev) => prev ?? data[0] ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [appUser]);

  useEffect(() => {
    if (selected) {
      getAssignmentsByChild(selected.id).then(setAssignments);
    }
  }, [selected]);

  async function handleAddChild(e: FormEvent) {
    e.preventDefault();
    if (!appUser || !name.trim() || !age) return;
    setSaving(true);
    await createChild({
      parentId: appUser.uid,
      name,
      age: Number(age),
      diagnosis: diagnosis ? diagnosis.split(",").map((d) => d.trim()) : [],
      currentWeek: 1,
    });
    setName("");
    setAge("");
    setDiagnosis("");
    setShowAddChild(false);
    setSaving(false);
    refresh();
  }

  const completedAssignments = assignments.filter((a) => a.status === "reviewed").length;
  const totalAssignments = assignments.length;
  const progressPercent =
    totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  if (loading) {
    return <p className="text-sm text-slate-500">Yüklənir...</p>;
  }

  if (children.length === 0) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <p className="text-slate-700">Hələ uşaq profili əlavə etməmisiniz.</p>
        {!showAddChild ? (
          <Button className="mt-4" onClick={() => setShowAddChild(true)}>
            Uşaq əlavə et
          </Button>
        ) : (
          <ChildForm
            name={name}
            age={age}
            diagnosis={diagnosis}
            setName={setName}
            setAge={setAge}
            setDiagnosis={setDiagnosis}
            onSubmit={handleAddChild}
            saving={saving}
          />
        )}
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Uşağınızın inkişaf icmalı</p>
        </div>

        <div className="flex items-center gap-2">
          <HelpModal title="Sayt necə işləyir?">
            <p>
              Xoş gəlmisiniz! Bu, övladınızın inkişafını izləmək və 12 həftəlik proqramı keçmək üçün
              platformanızdır. Aşağıdakı bölmələr var:
            </p>
            <p>
              <strong>📚 Kurslar</strong> — 12 modulluq təlim proqramı. Hər modulda sadə dildə dərslər
              var, oxuyub praktiki tövsiyələri evdə tətbiq edin.
            </p>
            <p>
              <strong>📝 Gündəlik</strong> — hər gün övladınızın yuxusu, davranışı, ünsiyyəti haqqında
              qısa qeyd yazın. Bu qeydlər <strong>AI üçün məlumat mənbəyidir</strong> — nə qədər
              müntəzəm yazsanız, AI bir o qədər dəqiq xülasə hazırlaya bilər.
            </p>
            <p>
              <strong>📈 İnkişaf izləmə</strong> — qeydləriniz əsasında qrafik və AI həftəlik xülasəsi.
            </p>
            <p>
              <strong>✅ Tapşırıqlar</strong> — mütəxəssisin verdiyi tapşırıqları (video/şəkil/qeyd)
              buradan göndərirsiniz, mütəxəssis baxıb rəy yazır.
            </p>
            <p>
              <strong>💬 Mesajlar</strong> — mütəxəssislə birbaşa yazışma.
            </p>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ⚠️ AI heç vaxt diaqnoz qoymur. O, sizin yazdıqlarınızı ümumiləşdirir və mütəxəssisə
              kömək edir — son qiymətləndirməni həmişə real mütəxəssis verir.
            </p>
          </HelpModal>
        </div>

        {children.length > 1 && (
          <select
            value={selected?.id}
            onChange={(e) => setSelected(children.find((c) => c.id === e.target.value) ?? null)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selected && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-slate-500">Uşağın adı</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{selected.name}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Yaş</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{selected.age}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Diaqnoz</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {selected.diagnosis.join(", ") || "Qeyd olunmayıb"}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Cari həftə</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{selected.currentWeek}/12</p>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <p className="text-sm text-slate-500">Tamamlanan tapşırıqlar</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {completedAssignments}/{totalAssignments}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">İrəliləyiş faizi</p>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-sm text-slate-500">{progressPercent}%</p>
            </Card>
          </div>

          <Card className="mt-6">
            <p className="text-sm font-medium text-slate-700">Tövsiyə</p>
            <p className="mt-2 text-sm text-slate-500">
              Hər gün gündəlik qeydlərinizi doldurun — bu, mütəxəssisin uşağınız üçün daha
              dəqiq tövsiyələr verməsinə kömək edir.
            </p>
          </Card>
        </>
      )}

      {!showAddChild ? (
        <button
          onClick={() => setShowAddChild(true)}
          className="mt-6 text-sm font-medium text-indigo-600 hover:underline"
        >
          + Başqa uşaq əlavə et
        </button>
      ) : (
        <Card className="mt-6 max-w-md">
          <ChildForm
            name={name}
            age={age}
            diagnosis={diagnosis}
            setName={setName}
            setAge={setAge}
            setDiagnosis={setDiagnosis}
            onSubmit={handleAddChild}
            saving={saving}
          />
        </Card>
      )}
    </div>
  );
}

function ChildForm(props: {
  name: string;
  age: string;
  diagnosis: string;
  setName: (v: string) => void;
  setAge: (v: string) => void;
  setDiagnosis: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  saving: boolean;
}) {
  return (
    <form onSubmit={props.onSubmit} className="space-y-3 text-left">
      <div>
        <Label htmlFor="childName">Uşağın adı</Label>
        <Input id="childName" value={props.name} onChange={(e) => props.setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="childAge">Yaşı</Label>
        <Input
          id="childAge"
          type="number"
          min={0}
          max={18}
          value={props.age}
          onChange={(e) => props.setAge(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="childDiagnosis">Diaqnoz (vergüllə ayırın)</Label>
        <Input
          id="childDiagnosis"
          value={props.diagnosis}
          onChange={(e) => props.setDiagnosis(e.target.value)}
          placeholder="Məs. Autizm spektri, Nitq gecikməsi"
        />
      </div>
      <Button type="submit" loading={props.saving} className="w-full">
        Yadda saxla
      </Button>
    </form>
  );
}
