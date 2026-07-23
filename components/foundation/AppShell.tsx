"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import EnterpriseFooter from "@/components/enterprise-shell/EnterpriseFooter";
import EnterpriseHeader from "@/components/enterprise-shell/EnterpriseHeader";

import AppProviders from "./AppProviders";

interface AppShellProps {
  children: ReactNode;
}

function StandardApplicationShell({
  children,
}: AppShellProps) {
  return (
    <div className="kafu-enterprise-shell">
      <EnterpriseHeader />

      <main className="kafu-enterprise-shell__content">
        {children}
      </main>

      <EnterpriseFooter />
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