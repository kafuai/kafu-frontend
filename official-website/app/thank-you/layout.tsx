import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Received",
  description:
    "Your KAFU AI executive demo request has been received.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}