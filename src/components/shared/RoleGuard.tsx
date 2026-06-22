"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

/**
 * Səhifəni yalnız müəyyən rollara malik daxil olmuş istifadəçilər üçün açır.
 * Digər hallarda /login-ə yönləndirir. Eyni zamanda push notification icazəsini
 * idarə edir.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { appUser, firebaseUser, loading } = useAuth();
  const router = useRouter();

  usePushNotifications();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser || !appUser) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(appUser.role)) {
      router.replace("/login");
    }
  }, [loading, firebaseUser, appUser, allowedRoles, router]);

  if (loading || !appUser || !allowedRoles.includes(appUser.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Yüklənir...
      </div>
    );
  }

  return <>{children}</>;
}
