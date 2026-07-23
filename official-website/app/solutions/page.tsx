import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Enterprise AI Solutions | KAFU AI",
  description:
    "Explore KAFU AI solutions that help executives, transformation leaders and enterprise teams make better decisions and execute with confidence.",
};

const executiveSolutions = [
  {
    label: "Leadership",
    title: "Executive Decision Intelligence",
    description:
      "Provide executives with clear visibility into priorities, risks, opportunities and recommended actions through one connected decision environment.",
  },
  {
    label: "Transformation",
    title: "Enterprise Transformation Management",
    description:
      "Coordinate transformation initiatives, dependencies, ownership and measurable progress from a single executive view.",
  },
  {
    label: "Knowledge",
    title: "Corporate Knowledge Intelligence",
    description:
      "Transform institutional knowledge into an enterprise asset that can be searched, understood and applied with confidence.",
  },
];

const operationalSolutions = [
  {
    label: "Operations",
    title: "Operational Visibility",
    description:
      "Connect operational activities, ownership, deadlines and performance into one coordinated operating environment.",
  },
  {
    label: "Workforce",
    title: "AI-Augmented Teams",
    description:
      "Support employees with AI capabilities aligned to business roles, governance, workflows and organizational context.",
  },
  {
    label: "Growth",
    title: "Commercial Intelligence",
    description:
      "Connect customer opportunities, executive priorities and commercial execution to support sustainable business growth.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <SectionHero
        eyebrow="Enterprise Solutions"
        title="Enterprise AI solutions focused on measurable business outcomes."
        description="KAFU AI helps organizations improve executive decision-making, enterprise transformation, operational coordination and organizational intelligence through one connected platform."
        primaryLabel="Book an Executive Discovery"
        primaryHref="/book-demo"
        secondaryLabel="Explore the Platform"
        secondaryHref="/platform"
      />

      <ContentSection
        eyebrow="Executive & Strategic Solutions"
        title="Support better leadership decisions across the enterprise."
        description="Transform fragmented information into executive clarity with solutions designed for leadership, transformation and organizational knowledge."
        tone="muted"
      >
        <FeatureGrid items={executiveSolutions} columns={3} />
      </ContentSection>

      <ContentSection
        eyebrow="Operational Solutions"
        title="Turn enterprise intelligence into coordinated execution."
        description="Extend intelligence beyond reporting by improving operational coordination, workforce effectiveness and commercial performance."
      >
        <FeatureGrid items={operationalSolutions} columns={3} />
      </ContentSection>

      <SectionCTA
        eyebrow="Executive Discovery"
        title="Identify the solution that creates the greatest value for your organization."
        description="Work with our team to evaluate your priorities, operating environment and transformation objectives before defining the right implementation approach."
        primaryLabel="Book Executive Discovery"
        primaryHref="/book-demo"
        secondaryLabel="Enterprise Readiness"
        secondaryHref="/enterprise"
      />
    </>
  );
}