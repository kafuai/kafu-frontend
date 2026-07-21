import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "About | KAFU AI",
  description:
    "Learn about KAFU AI and its mission to make enterprise intelligence practical, connected, and actionable.",
};

const principles = [
  {
    title: "Business Before Technology",
    description:
      "We begin with the organization, its priorities, its operating reality, and the decisions it needs to improve.",
  },
  {
    title: "Intelligence Must Be Actionable",
    description:
      "Enterprise intelligence should help leaders and teams decide, coordinate, execute, and measure—not simply generate more information.",
  },
  {
    title: "AI Must Operate Responsibly",
    description:
      "Human accountability, organizational controls, approved knowledge, and governance remain central to enterprise AI adoption.",
  },
  {
    title: "Transformation Must Be Connected",
    description:
      "Strategy, knowledge, decisions, operations, people, and technology must work as one connected transformation system.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionHero
        eyebrow="About KAFU AI"
        title="Building the enterprise intelligence layer for the AI-enabled organization."
        description="KAFU AI was created to help organizations move beyond fragmented tools and disconnected information toward a unified environment for understanding, decision-making, and execution."
        primaryLabel="Talk to KAFU AI"
        primaryHref="/contact"
        secondaryLabel="Explore the Platform"
        secondaryHref="/platform"
      />

      <ContentSection
        eyebrow="Our Mission"
        title="Make enterprise intelligence practical, connected, and actionable."
        description="We believe AI should strengthen how organizations understand themselves, make decisions, manage transformation, and enable their people."
        tone="muted"
      >
        <div className="narrative-panel">
          <p>
            Organizations already possess enormous knowledge, expertise, data,
            and ambition. The challenge is that these assets are often scattered
            across systems, documents, teams, and individual experience.
          </p>

          <p>
            KAFU AI connects that organizational context into an enterprise
            intelligence environment designed to support leadership, employees,
            and long-term transformation.
          </p>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="How We Think"
        title="Principles that guide the KAFU AI platform."
      >
        <FeatureGrid items={principles} columns={2} />
      </ContentSection>

      <SectionCTA
        eyebrow="Build the Next Operating Model"
        title="Explore what an AI-enabled enterprise could look like for your organization."
        description="Our executive conversation focuses on your business priorities, organizational readiness, and the outcomes that matter most."
        primaryLabel="Start the Conversation"
        primaryHref="/contact"
        secondaryLabel="Enterprise Approach"
        secondaryHref="/enterprise"
      />
    </>
  );
}