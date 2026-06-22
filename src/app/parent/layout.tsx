import { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { ParentSidebar } from "@/components/parent/ParentSidebar";

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["parent"]}>
      <div className="flex min-h-screen bg-slate-50">
        <ParentSidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </RoleGuard>
  );
}
