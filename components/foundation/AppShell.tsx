"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import EnterpriseHeader from "@/components/enterprise-shell/EnterpriseHeader";

import AppProviders from "./AppProviders";

interface AppShellProps {
  children: ReactNode;
}

function StandardApplicationShell({
  children,
}: AppShellProps) {
  return (
    <div className="enterprise-application-shell">
      <EnterpriseHeader />

      <main className="enterprise-application-content">
        {children}
      </main>
    </div>
  );
}

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const isImmersivePage = pathname === "/welcome";

  return (
    <AppProviders>
      {isImmersivePage ? (
        children
      ) : (
        <StandardApplicationShell>
          {children}
        </StandardApplicationShell>
      )}
    </AppProviders>
  );
}