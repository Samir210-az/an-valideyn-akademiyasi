"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[100vh] min-h-[640px] w-full overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 scale-110">
        <Image
          src="/images/landing/hero-1.jpg"
          alt="AN Valideyn Akademiyası — uşaqlar oyun otağında"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-indigo-900/55 to-white" />
      </motion.div>

      {/* Floating decorative blobs */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[18%] h-20 w-20 rounded-full bg-amber-300/30 blur-xl sm:h-28 sm:w-28"
      />
      <motion.div
        animate={{ y: [0, 22, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10%] top-[30%] h-24 w-24 rounded-full bg-pink-300/30 blur-xl sm:h-32 sm:w-32"
      />

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 rounded-full bg-white/15 px-5 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm sm:text-sm"
        >
          AN Psixoloji Dəstək və Reabilitasiya Mərkəzi
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-2xl font-black tracking-tight text-amber-300 drop-shadow-sm sm:text-3xl"
        >
          AN Valideyn Akademiyası
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
        >
          Övladınıza ən yaxşı dəstəyi —{" "}
          <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
            siz verə bilərsiniz
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-xl text-base text-indigo-50/90 sm:text-lg"
        >
          Autizm, DEHB, nitq gecikməsi və davranış çətinlikləri olan uşaqların valideynləri üçün
          12 həftəlik, mütəxəssis nəzarətli onlayn təlim proqramı. Evdə, öz vaxtınızda, real
          nəticələrlə.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button className="h-12 rounded-full bg-amber-400 px-8 text-base font-semibold text-indigo-950 shadow-lg shadow-amber-400/30 hover:bg-amber-300">
              Ödənişsiz başla →
            </Button>
          </Link>
          <Link href="#proqram">
            <Button
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/15"
            >
              Necə işləyir?
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-indigo-50/80"
        >
          <span>✓ 12 həftəlik struktur proqram</span>
          <span>✓ Mütəxəssis dəstəyi</span>
          <span>✓ Sertifikatlı bitiriş</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </div>
  );
}
