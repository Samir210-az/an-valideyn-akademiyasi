import { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { SpecialistSidebar } from "@/components/specialist/SpecialistSidebar";

export default function SpecialistLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["specialist"]}>
      <DashboardShell sidebar={<SpecialistSidebar />} title="Mütəxəssis Paneli" accent="specialist">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
