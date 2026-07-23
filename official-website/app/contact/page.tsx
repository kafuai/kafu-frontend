import type { Metadata } from "next";
import Link from "next/link";

import DemoRequestForm from "@/components/forms/DemoRequestForm";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Contact | KAFU AI",
  description:
    "Contact KAFU AI to discuss executive discovery, enterprise AI readiness, or strategic partnerships.",
};

const conversationTypes = [
  {
    title: "Executive Discovery",
    description:
      "Explore your organization's priorities, challenges, and opportunities through a focused executive conversation.",
  },
  {
    title: "Enterprise AI Readiness",
    description:
      "Discuss governance, organizational context, adoption strategy, and a practical roadmap for enterprise AI.",
  },
  {
    title: "Strategic Partnerships",
    description:
      "Connect with KAFU AI to explore technology alliances, consulting partnerships, and enterprise collaboration opportunities.",
  },
];

export default function ContactPage() {
  return (
    <>
      <SectionHero
        eyebrow="Contact KAFU AI"
        title="Let's start with your organization's priorities."
        description="Whether you are evaluating enterprise AI, planning transformation initiatives, or exploring strategic collaboration, we will tailor the conversation to your business objectives."
      />

      <section className="contact-section">
        <div className="site-container contact-layout">
          <div className="contact-panel contact-panel--primary">
            <span className="section-eyebrow">Get in Touch</span>

            <h2>Connect with the KAFU AI team.</h2>

            <p>
              Complete the form to request an executive discovery session,
              discuss enterprise AI readiness, or explore strategic
              partnership opportunities.
            </p>

            <a
              className="website-button website-button--secondary"
              href="mailto:hello@kafu.ai?subject=KAFU%20AI%20Executive%20Discovery"
            >
              Email hello@kafu.ai
            </a>

            <p className="contact-panel__note">
              Prefer email? Include your organization, your role, and the
              primary business challenge or opportunity you would like to
              discuss.
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

      <section className="demo-request-section">
        <div className="site-container">
          <div className="section-heading section-heading--centered">
            <span className="section-eyebrow">
              Request an Executive Conversation
            </span>

            <h2>Tell us where your organization wants to go next.</h2>

            <p>
              Share a few details about your priorities, current challenges,
              and the type of conversation you would like to begin.
            </p>
          </div>

          <DemoRequestForm />
        </div>
      </section>

      <section className="contact-next-step">
        <div className="site-container contact-next-step__inner">
          <div>
            <span className="section-eyebrow">Continue Exploring</span>
            <h2>Learn more before your executive conversation.</h2>
          </div>

          <div className="section-actions">
            <Link
              className="website-button website-button--primary"
              href="/platform"
            >
              Explore Platform
            </Link>

            <Link
              className="website-button website-button--secondary"
              href="/solutions"
            >
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}