import type { Metadata } from "next";

import DemoRequestForm from "@/components/forms/DemoRequestForm";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Book an Executive Demo | KAFU AI",
  description:
    "Request an executive demonstration of the KAFU AI enterprise intelligence platform.",
};

const briefingPoints = [
  "A guided view of the complete KAFU AI enterprise journey.",
  "Discussion focused on your strategic and operational priorities.",
  "Review of enterprise readiness, governance, and adoption options.",
  "Clear next steps based on your organizational context.",
];

export default function BookDemoPage() {
  return (
    <>
      <SectionHero
        eyebrow="Executive Demo"
        title="See how KAFU AI turns organizational complexity into executive clarity."
        description="Request a focused conversation tailored to your organization, leadership priorities, and AI transformation objectives."
      />

      <section className="demo-request-section">
        <div className="site-container demo-request-layout">
          <aside className="demo-briefing">
            <span className="section-eyebrow">
              What to Expect
            </span>

            <h2>A business-focused executive briefing.</h2>

            <p>
              The session is designed for executives, transformation
              leaders, and enterprise decision-makers evaluating practical
              AI adoption.
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
                Request Your Session
              </span>

              <h2>Tell us about your organization.</h2>

              <p>
                We will use this information to prepare a more relevant
                executive conversation.
              </p>
            </div>

            <DemoRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}