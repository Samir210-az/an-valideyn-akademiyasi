"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getChildrenByParent } from "@/lib/firestore/children";
import type { Child } from "@/types";

export default function ParentCertificatePage() {
  const { appUser } = useAuth();
  const [child, setChild] = useState<Child | null>(null);

  useEffect(() => {
    if (!appUser) return;
    getChildrenByParent(appUser.uid).then((children) => setChild(children[0] ?? null));
  }, [appUser]);

  if (!child) {
    return <p className="text-sm text-slate-500">Əvvəlcə Dashboard-dan uşaq profili əlavə edin.</p>;
  }

  const isCompleted = child.currentWeek >= 12;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Sertifikat</h1>
      <p className="mt-1 text-sm text-slate-500">
        12 həftəlik proqram tamamlandıqda avtomatik PDF sertifikat, QR kod və unikal nömrə yaradılır.
      </p>

      <Card className="mt-6 max-w-md text-center">
        {isCompleted ? (
          <>
            <p className="text-lg font-semibold text-emerald-600">Təbriklər! 🎉</p>
            <p className="mt-2 text-sm text-slate-600">
              {child.name} 12 həftəlik proqramı tamamladı. Sertifikat generasiya modulu
              (pdf-lib + QR kod) AI/PDF mərhələsində quraşdırılacaq.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500">Cari həftə</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{child.currentWeek}/12</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${(child.currentWeek / 12) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Sertifikat 12-ci həftə tamamlandıqda aktiv olacaq.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
