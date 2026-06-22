"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-28 text-center text-white">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 scale-125">
        <Image src="/images/landing/hero-3.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/85 to-indigo-900/85" />
      </motion.div>

      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Övladınızla bağlı ilk addımı bu gün atın
          </h2>
          <p className="mt-4 text-indigo-100/90">
            Qeydiyyat 2 dəqiqə çəkir. İlk modulu bu gün izləyin, fərqi öz gözünüzlə görün.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button className="h-12 rounded-full bg-amber-400 px-8 text-base font-semibold text-indigo-950 shadow-lg shadow-amber-400/30 hover:bg-amber-300">
              İndi qeydiyyatdan keç →
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
