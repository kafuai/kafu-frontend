import type { Metadata } from "next";

import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact | KAFU AI",
  description:
    "Contact KAFU AI to discuss executive discovery, enterprise AI readiness, or strategic partnerships.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
