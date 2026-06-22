"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { logoutUser } from "@/lib/auth-helpers";

const links = [
  { href: "/specialist/dashboard", label: "Dashboard" },
  { href: "/specialist/lessons", label: "Dərslər" },
  { href: "/specialist/assignments", label: "Tapşırıqlar" },
  { href: "/specialist/messages", label: "Mesajlar" },
];

export function SpecialistSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-l-4 border-l-teal-500 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 rounded-xl bg-teal-50 px-3 py-3">
        <p className="text-lg font-semibold text-slate-900">AN Akademiya</p>
        <p className="text-xs text-slate-500">Mütəxəssis Paneli</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname?.startsWith(link.href)
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await logoutUser();
          } finally {
            window.location.href = "/login";
          }
        }}
        className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Çıxış
      </button>
    </aside>
  );
}
