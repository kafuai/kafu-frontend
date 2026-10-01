"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import WorkspaceSidebar from "@/components/layout/WorkspaceSidebar";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  const pathname = usePathname();

  const usesStandaloneEnterpriseLayout =
    pathname === "/company-dashboard";

  if (usesStandaloneEnterpriseLayout) {
    return <>{children}</>;
  }

  return (
    <div className="workspace-layout">
      <div className="workspace-layout__container">
        <WorkspaceSidebar />

        <main className="workspace-layout__main">
          <WorkspaceHeader />

          <div className="workspace-layout__content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}