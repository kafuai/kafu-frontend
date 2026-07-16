import type { ReactNode } from "react";

import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import WorkspaceSidebar from "@/components/layout/WorkspaceSidebar";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
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