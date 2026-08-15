import type { Metadata } from "next";

import BookDemoContent from "./BookDemoContent";

export const metadata: Metadata = {
  title: "Executive Discovery Session | KAFU AI",
  description:
    "Request a focused executive discovery session to explore how KAFU AI can support your organization’s priorities, decisions, governance, and AI adoption.",
};

export default function BookDemoPage() {
  return <BookDemoContent />;
}
