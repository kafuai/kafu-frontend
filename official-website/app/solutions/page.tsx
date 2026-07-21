import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Solutions | KAFU AI",
  description:
    "Discover KAFU AI solutions for executives, transformation leaders, operations, and enterprise teams.",
};

const executiveSolutions = [
  {
    label: "Leadership",
    title: "Executive Decision Intelligence",
    description:
      "Provide leaders with concise, evidence-based visibility into performance, priorities, risks, and recommended decisions.",
  },
  {
    label: "Transformation",
    title: "Enterprise Transformation Management",
    description:
      "Create a connected view of transformation initiatives, dependencies, readiness, execution progress, and organizational impact.",
  },
  {
    label: "Knowledge",
    title: "Corporate Knowledge Intelligence",
    description:
      "Organize scattered organizational knowledge into a structured corporate brain that can be searched, interpreted, and applied.",
  },
];

const operationalSolutions = [
  {
    label: "Operations",
    title: "Operational Visibility",
    description:
      "Bring activities, responsibilities, issues, deadlines, and performance signals into a unified management environment.",
  },
  {
    label: "Workforce",
    title: "AI-Augmented Teams",
    description:
      "Support employees with AI capabilities designed around business roles, workflows, governance, and real organizational context.",
  },
  {
    label: "Growth",
    title: "Commercial Intelligence",
    description:
      "Connect market opportunities, customer context, executive priorities, and commercial execution into one decision-support flow.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <SectionHero
        eyebrow="Enterprise Solutions"
        title="AI solutions designed around business outcomes—not isolated tools."
        description="KAFU AI supports leaders and teams with connected solutions for executive decision-making, transformation, operations, organizational knowledge, and AI-enabled work."
        primaryLabel="Discuss Your Priorities"
        primaryHref="/contact"
        secondaryLabel="Explore the Platform"
        secondaryHref="/platform"
      />

      <ContentSection
        eyebrow="Executive and Strategic Solutions"
        title="Strengthen leadership visibility and enterprise decision-making."
        description="KAFU AI helps organizations turn complex strategic and operational information into clear executive direction."
        tone="muted"
      >
        <FeatureGrid items={executiveSolutions} columns={3} />
      </ContentSection>

      <ContentSection
        eyebrow="Operational Solutions"
        title="Connect enterprise intelligence to the work that moves the organization forward."
        description="Extend intelligence beyond reporting by supporting operational coordination, team execution, and commercial performance."
      >
        <FeatureGrid items={operationalSolutions} columns={3} />
      </ContentSection>

      <SectionCTA
        eyebrow="Solution Discovery"
        title="Start with the business challenge that matters most."
        description="We align the KAFU AI experience with your organizational priorities, operating context, and transformation objectives."
        primaryLabel="Start a Conversation"
        primaryHref="/contact"
        secondaryLabel="Enterprise Capabilities"
        secondaryHref="/enterprise"
      />
    </>
  );
}