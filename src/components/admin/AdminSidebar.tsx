"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { logoutUser } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/courses", label: "Kurslar" },
  { href: "/admin/users", label: "İstifadəçilər" },
  { href: "/admin/payments", label: "Ödənişlər" },
  { href: "/admin/reports", label: "Hesabatlar" },
  { href: "/admin/notifications", label: "Bildirişlər" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 px-2">
        <p className="text-lg font-semibold text-slate-900">AN Akademiya</p>
        <p className="text-xs text-slate-500">Admin Paneli</p>
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
        onClick={async () => {
          await logoutUser();
          router.push("/login");
        }}
        className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Çıxış
      </button>
    </aside>
  );
}
