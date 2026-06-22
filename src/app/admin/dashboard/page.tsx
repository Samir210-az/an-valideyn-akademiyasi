"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getAllUsers } from "@/lib/firestore/users";
import { getModules } from "@/lib/firestore/modules";
import type { AppUser, Module } from "@/types";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [u, m] = await Promise.all([getAllUsers(), getModules()]);
      setUsers(u);
      setModules(m);
      setLoading(false);
    })();
  }, []);

  const parentCount = users.filter((u) => u.role === "parent").length;
  const specialistCount = users.filter((u) => u.role === "specialist").length;

  const stats = [
    { label: "Valideynlər", value: parentCount },
    { label: "Mütəxəssislər", value: specialistCount },
    { label: "Modullar", value: modules.length },
    { label: "Ümumi istifadəçi", value: users.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Platformanın ümumi vəziyyətinə baxış</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : s.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
