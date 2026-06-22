import { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { ParentSidebar } from "@/components/parent/ParentSidebar";

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["parent"]}>
      <DashboardShell sidebar={<ParentSidebar />} title="Valideyn Paneli">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
