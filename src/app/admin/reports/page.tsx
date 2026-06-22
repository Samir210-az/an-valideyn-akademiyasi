"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getAllUsers } from "@/lib/firestore/users";
import { getModules } from "@/lib/firestore/modules";

export default function AdminReportsPage() {
  const [stats, setStats] = useState({ parents: 0, specialists: 0, modules: 0 });

  useEffect(() => {
    (async () => {
      const [users, modules] = await Promise.all([getAllUsers(), getModules()]);
      setStats({
        parents: users.filter((u) => u.role === "parent").length,
        specialists: users.filter((u) => u.role === "specialist").length,
        modules: modules.length,
      });
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Hesabatlar</h1>
      <p className="mt-1 text-sm text-slate-500">
        Platformanın ümumi performans göstəriciləri.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Aktiv valideynlər</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.parents}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Mütəxəssislər</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.specialists}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Yaradılmış modullar</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.modules}</p>
        </Card>
      </div>

      <Card className="mt-6">
        <p className="text-sm font-medium text-slate-700">Qeyd</p>
        <p className="mt-2 text-sm text-slate-500">
          Detallı analitik qrafiklər (tamamlanma faizi, gəlir, aktivlik trendi) Recharts ilə
          Valideyn İnkişaf İzləmə mərhələsində quraşdırılacaq.
        </p>
      </Card>
    </div>
  );
}
