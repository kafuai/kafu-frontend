import type { Metadata } from "next";
import Link from "next/link";

import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Contact | KAFU AI",
  description:
    "Contact KAFU AI to request an executive demo, enterprise briefing, or partnership conversation.",
};

const conversationTypes = [
  {
    title: "Executive Demo",
    description:
      "See the complete KAFU AI journey from organizational discovery to executive intelligence and AI-enabled execution.",
  },
  {
    title: "Enterprise Briefing",
    description:
      "Discuss AI readiness, governance, transformation priorities, and the appropriate enterprise adoption model.",
  },
  {
    title: "Strategic Partnership",
    description:
      "Explore collaboration opportunities with technology providers, advisors, implementation partners, and enterprise ecosystems.",
  },
];

export default function ContactPage() {
  return (
    <>
      <SectionHero
        eyebrow="Contact KAFU AI"
        title="Start an executive conversation about your organization’s AI future."
        description="Tell us what your organization is trying to achieve. We will align the conversation around your strategic priorities, operational challenges, and enterprise readiness."
      />

      <section className="contact-section">
        <div className="site-container contact-layout">
          <div className="contact-panel contact-panel--primary">
            <span className="section-eyebrow">Request a Conversation</span>

            <h2>Connect with the KAFU AI team.</h2>

            <p>
              Contact us to arrange an executive demo, enterprise briefing, or
              strategic partnership discussion.
            </p>

            <a
              className="website-button website-button--primary"
              href="mailto:hello@kafu.ai?subject=KAFU%20AI%20Executive%20Conversation"
            >
              hello@kafu.ai
            </a>

            <p className="contact-panel__note">
              Include your organization, role, and the primary business priority
              you would like to discuss.
            </p>
          </div>

          <div className="contact-options">
            {conversationTypes.map((item) => (
              <article className="contact-option" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-next-step">
        <div className="site-container contact-next-step__inner">
          <div>
            <span className="section-eyebrow">Prepare for the Conversation</span>
            <h2>Explore KAFU AI before your executive briefing.</h2>
          </div>

          <div className="section-actions">
            <Link className="website-button website-button--primary" href="/platform">
              View Platform
            </Link>

            <Link className="website-button website-button--secondary" href="/solutions">
              View Solutions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}