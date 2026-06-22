"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const parentGains = [
  "Övladınızı daha dərindən başa düşmək",
  "Hər gün üçün konkret, sınanmış addımlar",
  "Mütəxəssislə birbaşa əlaqə və geri bildirim",
  "Özünə inam — artıq tək addımlamırsınız",
];

const childGains = [
  "Ev mühitində ardıcıl, sevgi dolu dəstək",
  "Ünsiyyət və sosial bacarıqlarda inkişaf",
  "Sakitlik və davranışda müsbət dəyişiklik",
  "Müstəqillik yolunda inamlı addımlar",
];

export function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-24 text-white sm:py-32">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 scale-125">
        <Image src="/images/landing/hero-2.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-indigo-950/75" />
      </motion.div>

      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Hər iki tərəf qazanır</h2>
          <p className="mt-4 text-indigo-100/90">
            Bu yalnız övladınız üçün deyil — siz də valideyn olaraq inkişaf edirsiniz.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl bg-white/10 p-8 backdrop-blur-md ring-1 ring-white/15">
              <h3 className="text-xl font-bold text-amber-300">Siz qazanırsınız</h3>
              <ul className="mt-5 space-y-3">
                {parentGains.map((g) => (
                  <li key={g} className="flex gap-3 text-sm text-indigo-50">
                    <span className="mt-0.5 text-amber-300">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="h-full rounded-2xl bg-white/10 p-8 backdrop-blur-md ring-1 ring-white/15">
              <h3 className="text-xl font-bold text-pink-300">Övladınız qazanır</h3>
              <ul className="mt-5 space-y-3">
                {childGains.map((g) => (
                  <li key={g} className="flex gap-3 text-sm text-indigo-50">
                    <span className="mt-0.5 text-pink-300">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
