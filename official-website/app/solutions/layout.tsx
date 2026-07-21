import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Discover KAFU AI solutions for executive intelligence, organizational knowledge, governed AI adoption and coordinated enterprise execution.",
  alternates: {
    canonical: "/solutions",
  },
  openGraph: {
    title: "Solutions | KAFU AI",
    description:
      "Discover KAFU AI solutions for executive intelligence, organizational knowledge, governed AI adoption and coordinated enterprise execution.",
    url: "/solutions",
  },
  twitter: {
    title: "Solutions | KAFU AI",
    description:
      "Discover KAFU AI solutions for executive intelligence, organizational knowledge, governed AI adoption and coordinated enterprise execution.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}