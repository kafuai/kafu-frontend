import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import AppProviders from "@/components/foundation/AppProviders";
import "./globals.css";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KAFU AI",
  description: "AI Workforce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibmArabic.className}>
        <div className="min-h-screen bg-slate-50 text-slate-950">
          <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <Link
                href="/"
                className="shrink-0 text-2xl font-black tracking-tight text-slate-950"
              >
                KAFU AI
              </Link>

              <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
                <Link href="/">Home</Link>
                <Link href="/company-workspace">Workspace</Link>
                <Link href="/company-dashboard">Dashboard</Link>
                <Link href="/modules">Modules</Link>
                <Link href="/corporate-brain">Corporate Brain</Link>
              </div>
            </div>
          </nav>

          <AppProviders>
            <main>{children}</main>
          </AppProviders>
        </div>
      </body>
    </html>
  );
}