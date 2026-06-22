"use client";

import { Card } from "@/components/ui/card";

const PACKAGES = [
  { tier: "Basic", price: "29 AZN/ay", features: ["1 modul/ay sürəti", "Email dəstək"] },
  { tier: "Standard", price: "49 AZN/ay", features: ["Tam kurs", "Mütəxəssis rəyi", "Chat dəstək"] },
  { tier: "Premium", price: "79 AZN/ay", features: ["Tam kurs", "Həftəlik fərdi rəy", "Prioritet dəstək", "Sertifikat"] },
];

export default function AdminPaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Ödənişlər və Paketlər</h1>
      <p className="mt-1 text-sm text-slate-500">
        Abunəlik paketlərini idarə edin. Ödəniş Payriff (Azərbaycan ödəniş sistemi) ilə həyata keçirilir.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PACKAGES.map((p) => (
          <Card key={p.tier}>
            <p className="text-sm font-medium text-indigo-600">{p.tier}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{p.price}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <p className="text-sm font-medium text-slate-700">Abunəlik statistikası</p>
        <p className="mt-2 text-sm text-slate-400">
          Ödəniş provayderi qoşulduqdan sonra burada aktiv/bitmiş abunəliklər görünəcək.
        </p>
      </Card>
    </div>
  );
}
