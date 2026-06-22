"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getAllUsers } from "@/lib/firestore/users";
import type { AppUser } from "@/types";

const roleLabel: Record<AppUser["role"], string> = {
  admin: "Admin",
  specialist: "Mütəxəssis",
  parent: "Valideyn",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filter, setFilter] = useState<AppUser["role"] | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((u) => {
      setUsers(u);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">İstifadəçilər</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bütün admin, mütəxəssis və valideyn hesapları
      </p>

      <div className="mt-4 flex gap-2">
        {(["all", "admin", "specialist", "parent"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === r ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {r === "all" ? "Hamısı" : roleLabel[r]}
          </button>
        ))}
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  İstifadəçi tapılmadı.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.uid} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-800">{u.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {roleLabel[u.role]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
