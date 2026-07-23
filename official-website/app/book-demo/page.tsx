import type { Metadata } from "next";

import DemoRequestForm from "@/components/forms/DemoRequestForm";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Book an Executive Discovery | KAFU AI",
  description:
    "Book a focused executive discovery session to explore how KAFU AI can support your organization’s priorities, decisions, governance, and AI adoption.",
};

const briefingPoints = [
  "A focused discussion around your organization’s priorities and operating context.",
  "A guided view of how KAFU AI connects knowledge, decisions, and execution.",
  "An initial review of readiness, governance, and high-value use cases.",
  "Clear next steps based on your objectives and organizational maturity.",
];

export default function BookDemoPage() {
  return (
    <>
      <SectionHero
        eyebrow="Executive Discovery"
        title="Start with one focused conversation about your organization."
        description="Book a tailored executive session to explore where KAFU AI can create the greatest value across organizational knowledge, decision-making, governance, and execution."
      />

      <section className="demo-request-section">
        <div className="site-container demo-request-layout">
          <aside className="demo-briefing">
            <span className="section-eyebrow">What to Expect</span>

            <h2>A practical executive discovery session.</h2>

            <p>
              This session is designed for executives, transformation leaders,
              and enterprise decision-makers exploring a practical and governed
              approach to AI adoption.
            </p>

            <div className="demo-briefing__list">
              {briefingPoints.map((point, index) => (
                <div className="demo-briefing__item" key={point}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <div className="demo-briefing__contact">
              <strong>Prefer email?</strong>
              <a href="mailto:hello@kafu.ai">hello@kafu.ai</a>
            </div>
          </aside>

          <div className="demo-form-panel">
            <div className="demo-form-panel__heading">
              <span className="section-eyebrow">
                Request Your Executive Session
              </span>

              <h2>Tell us about your organization and priorities.</h2>

              <p>
                We will use this information to prepare a more relevant and
                focused executive conversation.
              </p>
            </div>

            <DemoRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}