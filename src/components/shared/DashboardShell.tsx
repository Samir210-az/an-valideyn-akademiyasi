"use client";

import { ReactNode, useState } from "react";

interface DashboardShellProps {
  sidebar: ReactNode;
  title: string;
  children: ReactNode;
}

/**
 * Admin/Mütəxəssis/Valideyn panelləri üçün ortaq, mobil-responsiv shell.
 * Böyük ekranlarda (lg+) sidebar həmişə görünür. Mobil ekranlarda sidebar
 * "drawer" (yan pəncərə) kimi açılıb-bağlanır, content kənara çıxmır.
 */
export function DashboardShell({ sidebar, title, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobil üst panel */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
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
        <div className="w-9" />
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
