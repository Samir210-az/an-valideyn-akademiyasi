"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

const plans = [
  {
    name: "Basic",
    price: "29",
    highlight: false,
    features: ["12 həftəlik tam video kurs", "Gündəlik izləmə sistemi", "Avtomatik irəliləyiş qrafiki", "Bitiriş sertifikatı"],
  },
  {
    name: "Standard",
    price: "49",
    highlight: true,
    features: ["Basic paketin hamısı", "Mütəxəssis tapşırıq yoxlaması", "Həftəlik fərdi fikir bildirim", "Mesajlaşma vasitəsilə dəstək"],
  },
  {
    name: "Premium",
    price: "79",
    highlight: false,
    features: ["Standard paketin hamısı", "Ay ərzində fərdi konsultasiya", "Detallı mütəxəssis hesabatı", "Prioritet dəstək"],
  },
];

export function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-white to-indigo-50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Planlar</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Sizə uyğun planı seçin</h2>
          <p className="mt-4 text-slate-600">İstənilən vaxt ləğv edə bilərsiniz. Gizli ödəniş yoxdur.</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-8 ${
                  p.highlight
                    ? "scale-[1.03] bg-indigo-600 text-white shadow-xl shadow-indigo-300/50 ring-2 ring-indigo-600"
                    : "bg-white text-slate-900 ring-1 ring-slate-200"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-indigo-950">
                    Ən çox seçilən
                  </span>
                )}
                <h3 className="text-lg font-bold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  <span className={p.highlight ? "text-indigo-100" : "text-slate-500"}>AZN/ay</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className={p.highlight ? "text-amber-300" : "text-indigo-600"}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-8">
                  <Button
                    className={`w-full rounded-full ${
                      p.highlight
                        ? "bg-white text-indigo-600 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Seç
                  </Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
