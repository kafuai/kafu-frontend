"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import WebsiteFooter from "@/components/layout/WebsiteFooter";
import WebsiteHeader from "@/components/layout/WebsiteHeader";

type WebsiteShellProps = {
  children: ReactNode;
};

export default function WebsiteShell({
  children,
}: WebsiteShellProps) {
  const pathname = usePathname();

  const isStandalonePage = pathname === "/thank-you";

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <>
      <WebsiteHeader />

      <main>{children}</main>

      <WebsiteFooter />
    </>
  );
}
