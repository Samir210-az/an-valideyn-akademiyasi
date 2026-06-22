"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PACKAGES } from "@/lib/payments/packages";
import type { PackageTier } from "@/types";

export default function ParentSubscriptionPage() {
  const { appUser } = useAuth();
  const [loadingTier, setLoadingTier] = useState<PackageTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(tier: PackageTier) {
    if (!appUser) return;
    setLoadingTier(tier);
    setError(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, parentId: appUser.uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ödəniş başladıla bilmədi.");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError((err as Error).message);
      setLoadingTier(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Abunəlik paketləri</h1>
      <p className="mt-1 text-sm text-slate-500">Ehtiyacınıza uyğun paketi seçin</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PACKAGES.map((p) => (
          <Card key={p.tier} className="flex flex-col">
            <p className="text-sm font-medium text-indigo-600">{p.name}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{p.priceAzn} AZN/ay</p>
            <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full"
              loading={loadingTier === p.tier}
              onClick={() => handleSubscribe(p.tier)}
            >
              Seç
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
