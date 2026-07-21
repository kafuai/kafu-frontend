import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Enterprise | KAFU AI",
  description:
    "Learn how KAFU AI supports enterprise governance, security, scalability, and responsible AI adoption.",
};

const enterprisePrinciples = [
  {
    title: "Enterprise Governance",
    description:
      "Clear ownership, controlled access, defined responsibilities, and structured oversight across the AI operating environment.",
  },
  {
    title: "Responsible AI Adoption",
    description:
      "AI capabilities are introduced within business context, human accountability, review processes, and organizational controls.",
  },
  {
    title: "Security by Design",
    description:
      "The platform architecture is designed to support secure data handling, controlled environments, and enterprise-grade operating practices.",
  },
  {
    title: "Organizational Context",
    description:
      "Recommendations and intelligence are grounded in the company’s priorities, structure, operating model, and approved knowledge.",
  },
  {
    title: "Scalable Architecture",
    description:
      "A modular platform foundation supports expansion across functions, business units, use cases, and organizational maturity levels.",
  },
  {
    title: "Human-Centered Execution",
    description:
      "KAFU AI augments leadership and employees while keeping critical decisions, approvals, and accountability with people.",
  },
];

const adoptionModel = [
  {
    label: "Stage 1",
    title: "Discover",
    description:
      "Establish the organizational context, strategic priorities, operational realities, and transformation objectives.",
  },
  {
    label: "Stage 2",
    title: "Activate",
    description:
      "Configure the relevant platform capabilities, executive experiences, knowledge sources, and role-based AI support.",
  },
  {
    label: "Stage 3",
    title: "Scale",
    description:
      "Expand adoption across workflows, teams, and business units through measurable and governed implementation.",
  },
];

export default function EnterprisePage() {
  return (
    <>
      <SectionHero
        eyebrow="Enterprise Readiness"
        title="Built for responsible adoption across complex organizations."
        description="KAFU AI is designed as an enterprise operating platform with governance, organizational context, human accountability, and scalable adoption at its core."
        primaryLabel="Schedule an Enterprise Briefing"
        primaryHref="/contact"
        secondaryLabel="View the Platform"
        secondaryHref="/platform"
      />

      <ContentSection
        eyebrow="Enterprise Principles"
        title="A controlled foundation for AI-enabled transformation."
        description="Enterprise AI requires more than technical capability. It requires governance, trust, context, accountability, and a clear operating model."
        tone="muted"
      >
        <FeatureGrid items={enterprisePrinciples} columns={3} />
      </ContentSection>

      <ContentSection
        eyebrow="Adoption Model"
        title="Move from executive alignment to measurable enterprise adoption."
        description="KAFU AI supports a staged journey that reduces implementation risk while building long-term organizational capability."
      >
        <FeatureGrid items={adoptionModel} columns={3} />
      </ContentSection>

      <SectionCTA
        eyebrow="Enterprise Engagement"
        title="Define a practical AI adoption path for your organization."
        description="Begin with an executive briefing focused on your priorities, readiness, governance requirements, and transformation objectives."
        primaryLabel="Request an Enterprise Briefing"
        primaryHref="/contact"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />
    </>
  );
}