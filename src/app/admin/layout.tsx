import { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell sidebar={<AdminSidebar />} title="Admin Paneli" accent="admin">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
