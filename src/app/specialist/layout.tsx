import { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { SpecialistSidebar } from "@/components/specialist/SpecialistSidebar";

export default function SpecialistLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["specialist"]}>
      <div className="flex min-h-screen bg-slate-50">
        <SpecialistSidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </RoleGuard>
  );
}
