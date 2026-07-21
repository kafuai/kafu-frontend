import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Explore the KAFU AI enterprise intelligence platform connecting organizational knowledge, executive decisions and coordinated execution.",
  alternates: {
    canonical: "/platform",
  },
  openGraph: {
    title: "Platform | KAFU AI",
    description:
      "Explore the KAFU AI enterprise intelligence platform connecting organizational knowledge, executive decisions and coordinated execution.",
    url: "/platform",
  },
  twitter: {
    title: "Platform | KAFU AI",
    description:
      "Explore the KAFU AI enterprise intelligence platform connecting organizational knowledge, executive decisions and coordinated execution.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}