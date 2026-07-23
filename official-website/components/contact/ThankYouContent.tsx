"use client";

import Link from "next/link";

import { useWebsiteTranslations } from "@/components/localization";

export default function ThankYouContent() {
  const { translations } = useWebsiteTranslations();
  const content = translations.thankYou;

  return (
    <main className="thank-you-page">
      <div className="thank-you-card">
        <div className="thank-you-card__mark" aria-hidden="true">
          ✓
        </div>

        <span className="section-eyebrow">{content.eyebrow}</span>

        <h1>{content.title}</h1>

        <p>{content.description}</p>

        <div className="section-actions">
          <Link
            className="website-button website-button--primary"
            href="/"
          >
            {content.home}
          </Link>

          <Link
            className="website-button website-button--secondary"
            href="/platform"
          >
            {content.platform}
          </Link>
        </div>
      </div>
    </main>
  );
}
