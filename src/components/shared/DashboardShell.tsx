"use client";

import { ReactNode, useState } from "react";
import { logoutUser } from "@/lib/auth-helpers";

type Accent = "admin" | "parent" | "specialist";

interface DashboardShellProps {
  sidebar: ReactNode;
  title: string;
  children: ReactNode;
  accent?: Accent;
}

const ACCENT_BG: Record<Accent, string> = {
  admin: "bg-gradient-to-br from-slate-100 via-indigo-50/60 to-slate-100",
  parent: "bg-gradient-to-br from-orange-50 via-rose-50/50 to-indigo-50/60",
  specialist: "bg-gradient-to-br from-teal-50 via-emerald-50/50 to-indigo-50/50",
};

const ACCENT_HEADER: Record<Accent, string> = {
  admin: "bg-white/90",
  parent: "bg-white/90",
  specialist: "bg-white/90",
};

async function handleLogout() {
  try {
    await logoutUser();
  } finally {
    window.location.href = "/login";
  }
}

/**
 * Admin/Mütəxəssis/Valideyn panelləri üçün ortaq, mobil-responsiv shell.
 * Hər rol üçün yüngül, fərqli fon tonu var ki, hamısı eyni "ağ səhifə" kimi görünməsin.
 * Böyük ekranlarda (lg+) sidebar həmişə görünür. Mobil ekranlarda sidebar
 * "drawer" (yan pəncərə) kimi açılıb-bağlanır, content kənara çıxmır.
 * Çıxış düyməsi mobil üst paneldə HƏMIŞƏ görünür (menyu açmağa ehtiyac yoxdur).
 */
export function DashboardShell({ sidebar, title, children, accent = "admin" }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`min-h-screen ${ACCENT_BG[accent]}`}>
      {/* Mobil üst panel */}
      <div className={`flex items-center justify-between border-b border-slate-200 px-4 py-3 backdrop-blur-sm lg:hidden ${ACCENT_HEADER[accent]}`}>
        <button
          onClick={() => setOpen(true)}
          aria-label="Menyu aç"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <button
          onClick={handleLogout}
          aria-label="Çıxış"
          className="flex items-center gap-1 rounded-lg p-2 text-red-600 hover:bg-red-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Mobil overlay (sidebar açıqkən arxa fonu tutur) */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar: mobil-də drawer, lg+-da statik */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 lg:static lg:translate-x-0 lg:transform-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={() => setOpen(false)}
        >
          {sidebar}
        </div>

        {/* Əsas content — kənara çıxmasın deyə min-w-0 və overflow-hidden */}
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
