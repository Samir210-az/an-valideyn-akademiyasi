"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const modules = [
  { week: "1–2", title: "Tanışlıq və müşahidə", desc: "Övladınızı yeni gözlə tanıma, gündəlik izləmə vərdişi." },
  { week: "3–4", title: "Ünsiyyət bacarıqları", desc: "Göz təması, işarə, sadə tələblərin başa düşülməsi." },
  { week: "5–6", title: "Davranış idarəetməsi", desc: "Sakitləşdirmə texnikaları, məlumatlı reaksiya vermə." },
  { week: "7–8", title: "Sensor dəstək", desc: "Həssaslıqları tanımaq və evdə sensor mühit yaratmaq." },
  { week: "9–10", title: "Sosial inkişaf", desc: "Növbə gözləmə, paylaşma, oyun vasitəsilə ünsiyyət." },
  { week: "11–12", title: "Müstəqillik və nəticə", desc: "Gündəlik rutinlər, irəliləyişin qiymətləndirilməsi, sertifikat." },
];

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

export function ProgramSection() {
  return (
    <section id="proqram" className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Proqram</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">12 həftə, real dəyişiklik</h2>
          <p className="mt-4 text-slate-600">
            Hər modul əvvəlkinin üzərində qurulur — qarmaşıq nəzəriyyə yox, evdə dərhal tətbiq edə biləcəyiniz addımlar.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal key={m.week} delay={(i % 3) * 0.1}>
              <div className="group relative h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-lg">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                  {m.week}-ci həftə
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{m.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <ParallaxImage src="/images/landing/gallery-1.jpg" alt="AN Akademiya təlim otağı" />
          </Reveal>
          <Reveal delay={0.15}>
            <ParallaxImage src="/images/landing/gallery-2.jpg" alt="Uşaqlar birgə oyun zamanı" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
