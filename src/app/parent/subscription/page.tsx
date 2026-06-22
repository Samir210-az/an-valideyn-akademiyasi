"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpModal } from "@/components/shared/HelpModal";
import { useAuth } from "@/context/AuthContext";
import { PACKAGES } from "@/lib/payments/packages";
import { getSubscription, type SubscriptionDoc } from "@/lib/firestore/subscriptions";
import type { PackageTier } from "@/types";

const FRIENDLY_ERROR =
  "Hazırda kart ödənişi texniki sazlama mərhələsindədir. Zəhmət olmasa admin ilə əlaqə saxlayın — sizin üçün abunəliyi əl ilə aktivləşdirə bilər.";

export default function ParentSubscriptionPage() {
  const { appUser } = useAuth();
  const [loadingTier, setLoadingTier] = useState<PackageTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDoc | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    getSubscription(appUser.uid).then((sub) => {
      setSubscription(sub);
      setChecking(false);
    });
  }, [appUser]);

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
      const msg = (err as Error).message;
      setError(msg.includes("PAYRIFF_SECRET_KEY") ? FRIENDLY_ERROR : msg);
      setLoadingTier(null);
    }
  }

  if (checking) {
    return <p className="text-sm text-slate-400">Yüklənir...</p>;
  }

  if (subscription?.status === "active") {
    const pkg = PACKAGES.find((p) => p.tier === subscription.tier);
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Abunəlik paketləri</h1>
        <Card className="mt-6 max-w-md border-emerald-200 bg-emerald-50">
          <p className="text-sm font-medium text-emerald-800">
            ✓ Hazırda <strong>{pkg?.name ?? subscription.tier}</strong> paketiniz aktivdir.
          </p>
          {subscription.expiresAt && (
            <p className="mt-1 text-xs text-emerald-700">
              Etibarlılıq müddəti: {new Date(subscription.expiresAt).toLocaleDateString("az-AZ")}
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Abunəlik paketləri</h1>
          <p className="mt-1 text-sm text-slate-500">Ehtiyacınıza uyğun paketi seçin</p>
        </div>
        <HelpModal title="Paketlər arasında fərq nədir?">
          <p><strong>Basic</strong> — kursa giriş, aylıq 1 modul sürəti ilə, email dəstəyi.</p>
          <p><strong>Standard</strong> — tam kursa giriş, mütəxəssis rəyi, chat dəstəyi.</p>
          <p><strong>Premium</strong> — Standard-ın hamısı + həftəlik fərdi rəy, prioritet dəstək, sertifikat.</p>
          <p className="text-xs text-slate-500">
            Əgər ödəniş düyməsi xəta versə, admin ilə əlaqə saxlayın — sizin üçün abunəliyi əl ilə
            aktivləşdirə bilərlər.
          </p>
        </HelpModal>
      </div>

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
