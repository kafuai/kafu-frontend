import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Executive Demo",
  description:
    "Request a focused KAFU AI executive demo and identify a high-value enterprise intelligence use case for your organization.",
  alternates: {
    canonical: "/book-demo",
  },
  openGraph: {
    title: "Book an Executive Demo | KAFU AI",
    description:
      "Request a focused KAFU AI executive demo and identify a high-value enterprise intelligence use case for your organization.",
    url: "/book-demo",
  },
  twitter: {
    title: "Book an Executive Demo | KAFU AI",
    description:
      "Request a focused KAFU AI executive demo and identify a high-value enterprise intelligence use case for your organization.",
  },
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}