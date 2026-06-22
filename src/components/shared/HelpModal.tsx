"use client";

import { ReactNode, useState } from "react";

interface HelpModalProps {
  title: string;
  children: ReactNode;
}

/**
 * Hər səhifənin yuxarısına qoyulan "Necə istifadə olunur?" düyməsi.
 * Basıldıqda izahlı, addım-addım təlimat pəncərəsi açılır.
 */
export function HelpModal({ title, children }: HelpModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
      >
        <span className="text-sm">❓</span> Necə istifadə olunur?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Bağla"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              {children}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
