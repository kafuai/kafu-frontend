import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import AppShell from "@/components/foundation/AppShell";

import "./globals.css";
import "./styles/enterprise-header.css";
import "./styles/enterprise-shell.css";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KAFU AI",
  description: "Enterprise AI Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibmArabic.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
