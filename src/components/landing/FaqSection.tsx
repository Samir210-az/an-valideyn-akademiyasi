"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "Bu proqram terapiyanı əvəz edir?",
    a: "Xeyr. AN Valideyn Akademiyası mütəxəssis terapiyasını əvəz etmir — onu evdə davamlı, düzgün dəstəklə tamamlayır. Diaqnoz qoymur, müalicə təyin etmir.",
  },
  {
    q: "Övladımın diaqnozu yoxdursa, qoşula bilərəmmi?",
    a: "Bəli. Proqram həm təşxis qoyulmuş, həm də sadəcə narahatlıq duyduğunuz hallar üçün faydalıdır.",
  },
  {
    q: "Həftədə nə qədər vaxt lazımdır?",
    a: "Hər modul üçün ortalama 20-30 dəqiqəlik video və gündəlik 5-10 dəqiqəlik tətbiq kifayətdir. Tam öz vaxtınızda, öz ritminizdə.",
  },
  {
    q: "Mütəxəssis dəstəyi necə işləyir?",
    a: "Tapşırıqlarınızı (video/qeyd) yüklədikdən sonra təyin olunmuş mütəxəssis onları izləyir, fikir bildirir və mesaj vasitəsilə sualınıza cavab verir.",
  },
  {
    q: "Proqramı bitirdikdən sonra nə alıram?",
    a: "Rəsmi, QR-kodlu elektron sertifikat və övladınızın 12 həftəlik irəliləyiş hesabatı.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-gradient-to-b from-orange-50 to-rose-50/60 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Tez-tez verilən suallar</h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 bg-slate-50 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                  >
                    {f.q}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-xl text-indigo-600">
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 py-4 text-sm text-slate-600">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
