import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KAFU AI | Enterprise Intelligence Platform",
    template: "%s | KAFU AI",
  },
  description:
    "KAFU AI connects organizational knowledge, executive decision intelligence and coordinated AI execution in one governed enterprise environment.",
  keywords: [
    "KAFU AI",
    "enterprise AI",
    "executive intelligence",
    "decision intelligence",
    "corporate brain",
    "digital workforce",
    "enterprise transformation",
  ],
  openGraph: {
    title: "KAFU AI | Enterprise Intelligence Platform",
    description:
      "Transform organizational knowledge into executive clarity and coordinated execution.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
