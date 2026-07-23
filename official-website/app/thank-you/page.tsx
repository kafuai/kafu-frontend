import type { Metadata } from "next";

import ThankYouContent from "@/components/contact/ThankYouContent";

export const metadata: Metadata = {
  title: "Request Received | KAFU AI",
  description:
    "Your KAFU AI executive discovery request has been received.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
