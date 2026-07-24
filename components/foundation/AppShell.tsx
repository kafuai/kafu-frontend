"use client";

import type {
  ReactNode,
} from "react";
import {
  usePathname,
} from "next/navigation";

import EnterpriseFooter from "@/components/enterprise-shell/EnterpriseFooter";
import EnterpriseHeader from "@/components/enterprise-shell/EnterpriseHeader";

import AppProviders from "./AppProviders";
import DemoNavigationGuard from "./DemoNavigationGuard";

interface AppShellProps {
  children: ReactNode;
}

const immersiveRoutes = new Set([
  "/welcome",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

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
  const isImmersivePage =
    immersiveRoutes.has(pathname);

  return (
    <AppProviders>
      <DemoNavigationGuard>
        {isImmersivePage ? (
          children
        ) : (
          <StandardApplicationShell>
            {children}
          </StandardApplicationShell>
        )}
      </DemoNavigationGuard>
    </AppProviders>
  );
}
