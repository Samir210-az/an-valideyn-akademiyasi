"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const stats = [
  { to: 12, suffix: "", label: "həftəlik proqram" },
  { to: 6, suffix: "", label: "inkişaf modulu" },
  { to: 100, suffix: "%", label: "evdə tətbiq olunan" },
  { to: 7, suffix: "/24", label: "mütəxəssis dəstəyi" },
];

export function StatsSection() {
  return (
    <section className="border-y border-slate-100 bg-white px-4 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="text-center">
            <div className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-slate-500">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
