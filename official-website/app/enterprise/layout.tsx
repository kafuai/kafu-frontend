import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise",
  description:
    "Adopt enterprise AI with governance, controlled access, human accountability and measurable organizational outcomes.",
  alternates: {
    canonical: "/enterprise",
  },
  openGraph: {
    title: "Enterprise | KAFU AI",
    description:
      "Adopt enterprise AI with governance, controlled access, human accountability and measurable organizational outcomes.",
    url: "/enterprise",
  },
  twitter: {
    title: "Enterprise | KAFU AI",
    description:
      "Adopt enterprise AI with governance, controlled access, human accountability and measurable organizational outcomes.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}