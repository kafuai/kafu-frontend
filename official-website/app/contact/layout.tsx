import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact KAFU AI to discuss your organization, executive priorities and enterprise intelligence requirements.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | KAFU AI",
    description:
      "Contact KAFU AI to discuss your organization, executive priorities and enterprise intelligence requirements.",
    url: "/contact",
  },
  twitter: {
    title: "Contact | KAFU AI",
    description:
      "Contact KAFU AI to discuss your organization, executive priorities and enterprise intelligence requirements.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}