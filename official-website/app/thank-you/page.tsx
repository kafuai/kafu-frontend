import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request Received | KAFU AI",
  description:
    "Your KAFU AI executive demo request has been received.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="thank-you-page">
      <div className="thank-you-card">
        <div className="thank-you-card__mark" aria-hidden="true">
          ✓
        </div>

        <span className="section-eyebrow">Request Received</span>

        <h1>Thank you for contacting KAFU AI.</h1>

        <p>
          Your request has been received. Our team will review your
          information and follow up regarding the appropriate executive
          conversation.
        </p>

        <div className="section-actions">
          <Link
            className="website-button website-button--primary"
            href="/"
          >
            Return Home
          </Link>

          <Link
            className="website-button website-button--secondary"
            href="/platform"
          >
            Explore Platform
          </Link>
        </div>
      </div>
    </main>
  );
}