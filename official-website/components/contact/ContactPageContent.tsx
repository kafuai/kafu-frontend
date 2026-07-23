"use client";

import Link from "next/link";

import DemoRequestForm from "@/components/forms/DemoRequestForm";
import SectionHero from "@/components/shared/SectionHero";
import { useWebsiteTranslations } from "@/components/localization";

export default function ContactPageContent() {
  const { translations } = useWebsiteTranslations();
  const content = translations.contact;

  return (
    <>
      <SectionHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
      />

      <section className="contact-section">
        <div className="site-container contact-layout">
          <div className="contact-panel contact-panel--primary">
            <span className="section-eyebrow">
              {content.panel.eyebrow}
            </span>

            <h2>{content.panel.title}</h2>

            <p>{content.panel.description}</p>

            <a
              className="website-button website-button--secondary"
              href="mailto:hello@kafu.ai?subject=KAFU%20AI%20Executive%20Discovery"
            >
              {content.panel.emailButton}
            </a>

            <p className="contact-panel__note">
              {content.panel.note}
            </p>
          </div>

          <div className="contact-options">
            {content.conversationTypes.map((item) => (
              <article className="contact-option" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="demo-request-section">
        <div className="site-container">
          <div className="section-heading section-heading--centered">
            <span className="section-eyebrow">
              {content.formSection.eyebrow}
            </span>

            <h2>{content.formSection.title}</h2>

            <p>{content.formSection.description}</p>
          </div>

          <DemoRequestForm />
        </div>
      </section>

      <section className="contact-next-step">
        <div className="site-container contact-next-step__inner">
          <div>
            <span className="section-eyebrow">
              {content.nextStep.eyebrow}
            </span>

            <h2>{content.nextStep.title}</h2>
          </div>

          <div className="section-actions">
            <Link
              className="website-button website-button--primary"
              href="/platform"
            >
              {content.nextStep.platform}
            </Link>

            <Link
              className="website-button website-button--secondary"
              href="/solutions"
            >
              {content.nextStep.solutions}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
