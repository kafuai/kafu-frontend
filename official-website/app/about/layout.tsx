import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how KAFU AI helps organizations transform institutional knowledge into executive clarity and coordinated action.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | KAFU AI",
    description:
      "Learn how KAFU AI helps organizations transform institutional knowledge into executive clarity and coordinated action.",
    url: "/about",
  },
  twitter: {
    title: "About | KAFU AI",
    description:
      "Learn how KAFU AI helps organizations transform institutional knowledge into executive clarity and coordinated action.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}