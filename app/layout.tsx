import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import AppShell from "@/components/foundation/AppShell";

import "./globals.css";
import "./styles/enterprise-header.css";
import "./styles/enterprise-shell.css";
import "./styles/enterprise-workspace.css";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kafuai.com"),
  title: {
    default: "KAFU AI",
    template: "%s | KAFU AI",
  },
  description:
    "Enterprise intelligence platform connecting organizational knowledge, executive decision-making, governance, and AI-enabled execution.",
  applicationName: "KAFU AI",
  keywords: [
    "Enterprise AI",
    "Executive Intelligence",
    "Corporate Brain",
    "AI Platform",
    "Digital Workforce",
    "Enterprise Transformation",
    "Decision Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={ibmArabic.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}