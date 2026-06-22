"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getAllAssignments } from "@/lib/firestore/assignments";
import { getUsersByRole } from "@/lib/firestore/users";
import type { Assignment, AppUser } from "@/types";

export default function SpecialistDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [parents, setParents] = useState<AppUser[]>([]);

  useEffect(() => {
    getAllAssignments().then(setAssignments);
    getUsersByRole("parent").then(setParents);
  }, []);

  const pending = assignments.filter((a) => a.status === "submitted").length;
  const reviewed = assignments.filter((a) => a.status === "reviewed").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Mütəxəssis Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Yoxlanılmamış tapşırıqlar və ümumi icmal</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Yoxlanılmamış tapşırıq</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pending}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Qiymətləndirilmiş</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{reviewed}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Aktiv valideynlər</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{parents.length}</p>
        </Card>
      </div>
    </div>
  );
}
