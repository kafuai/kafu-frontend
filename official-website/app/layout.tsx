import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import LanguageProvider from "@/components/localization/LanguageProvider";
import WebsiteShell from "@/components/layout/WebsiteShell";
import { siteConfig } from "@/config/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "KAFU AI | Enterprise Intelligence Platform",
    template: "%s | KAFU AI",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Enterprise Software",
  keywords: [
    "KAFU AI",
    "enterprise AI",
    "executive intelligence",
    "decision intelligence",
    "corporate brain",
    "digital workforce",
    "enterprise transformation",
    "AI governance",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KAFU AI | Enterprise Intelligence Platform",
    description:
      "Transform organizational knowledge into executive clarity and coordinated execution.",
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    alternateLocale: ["ar_BH"],
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "KAFU AI Enterprise Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAFU AI | Enterprise Intelligence Platform",
    description:
      "Transform organizational knowledge into executive clarity and coordinated execution.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071321",
  colorScheme: "light",
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  description: siteConfig.description,
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = JSON.stringify([
    organizationStructuredData,
    websiteStructuredData,
  ]).replace(/</g, "\\u003c");

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.variable}>
        <LanguageProvider>
          <WebsiteShell>{children}</WebsiteShell>
        </LanguageProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </body>
    </html>
  );
}
