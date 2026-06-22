"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers, updateUserRole, deleteUserProfile } from "@/lib/firestore/users";
import { getSubscription, setSubscriptionManual, deactivateSubscription } from "@/lib/firestore/subscriptions";
import type { AppUser, PackageTier, UserRole } from "@/types";

const roleLabel: Record<AppUser["role"], string> = {
  admin: "Admin",
  specialist: "Mütəxəssis",
  parent: "Valideyn",
};

const tierLabel: Record<PackageTier, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

export default function AdminUsersPage() {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filter, setFilter] = useState<AppUser["role"] | "all">("all");
  const [loading, setLoading] = useState(true);
  const [subs, setSubs] = useState<Record<string, { tier: PackageTier; status: string } | null>>({});
  const [pendingTier, setPendingTier] = useState<Record<string, PackageTier>>({});
  const [busyUid, setBusyUid] = useState<string | null>(null);

  async function loadUsers() {
    const u = await getAllUsers();
    setUsers(u);
    setLoading(false);
    const parents = u.filter((x) => x.role === "parent");
    const entries = await Promise.all(
      parents.map(async (p) => [p.uid, await getSubscription(p.uid)] as const)
    );
    setSubs(Object.fromEntries(entries.map(([uid, sub]) => [uid, sub ? { tier: sub.tier, status: sub.status } : null])));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleActivate(uid: string) {
    const tier = pendingTier[uid] ?? "standard";
    setBusyUid(uid);
    await setSubscriptionManual(uid, tier);
    setSubs((prev) => ({ ...prev, [uid]: { tier, status: "active" } }));
    setBusyUid(null);
  }

  async function handleDeactivate(uid: string) {
    setBusyUid(uid);
    await deactivateSubscription(uid);
    setSubs((prev) => ({ ...prev, [uid]: prev[uid] ? { ...prev[uid]!, status: "inactive" } : null }));
    setBusyUid(null);
  }

  async function handleRoleChange(uid: string, role: UserRole) {
    if (uid === appUser?.uid) {
      alert("Öz rolunuzu bu paneldən dəyişə bilməzsiniz (özünüzü kənarlaşdırmamaq üçün).");
      return;
    }
    setBusyUid(uid);
    await updateUserRole(uid, role);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
    setBusyUid(null);
  }

  async function handleDelete(u: AppUser) {
    if (u.uid === appUser?.uid) {
      alert("Öz hesabınızı silə bilməzsiniz.");
      return;
    }
    if (
      !confirm(
        `"${u.fullName}" (${u.email}) hesabını silmək istədiyinizə əminsiniz? Bu, onun saytdan istifadəsini dərhal dayandıracaq.`
      )
    )
      return;
    setBusyUid(u.uid);
    await deleteUserProfile(u.uid);
    setUsers((prev) => prev.filter((x) => x.uid !== u.uid));
    setBusyUid(null);
  }

  const filtered = filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">İstifadəçilər</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bütün admin, mütəxəssis və valideyn hesapları
      </p>

      <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        ⚠️ Kart ödənişi (Payriff) hələ qoşulmayıb. Bu vaxta qədər valideynlərin abunəliyini bu səhifədən
        <strong> manual</strong> aktivləşdirə bilərsiniz.
      </p>
      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        💡 Kimisə mütəxəssis etmək üçün: həmin şəxs əvvəlcə adi qeydiyyatdan keçsin, sonra aşağıdaki
        cədvəldə onun "Rol" sahəsindən <strong>Mütəxəssis</strong>i seçin.
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

      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Abunəlik</th>
              <th className="px-4 py-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  İstifadəçi tapılmadı.
                </td>
              </tr>
            )}
            {filtered.map((u) => {
              const sub = subs[u.uid];
              const isSelf = u.uid === appUser?.uid;
              return (
                <tr key={u.uid} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">
                    {u.fullName} {isSelf && <span className="text-xs text-slate-400">(siz)</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={u.role}
                      disabled={isSelf || busyUid === u.uid}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                      className="h-8 w-32 py-1 text-xs"
                    >
                      <option value="parent">Valideyn</option>
                      <option value="specialist">Mütəxəssis</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "parent" ? (
                      <span className="text-slate-400">—</span>
                    ) : sub?.status === "active" ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          {tierLabel[sub.tier]} · aktiv
                        </span>
                        <button
                          disabled={busyUid === u.uid}
                          onClick={() => handleDeactivate(u.uid)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Söndür
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select
                          value={pendingTier[u.uid] ?? "standard"}
                          onChange={(e) =>
                            setPendingTier((prev) => ({ ...prev, [u.uid]: e.target.value as PackageTier }))
                          }
                          className="h-8 w-28 py-1 text-xs"
                        >
                          <option value="basic">Basic</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                        </Select>
                        <Button
                          loading={busyUid === u.uid}
                          onClick={() => handleActivate(u.uid)}
                          className="h-8 px-3 text-xs"
                        >
                          Aktivləşdir
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={isSelf || busyUid === u.uid}
                      onClick={() => handleDelete(u)}
                      className="text-xs text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
