import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Platform | KAFU AI",
  description:
    "Explore the KAFU AI enterprise intelligence platform for organizational discovery, executive insight, and AI-powered execution.",
};

const platformCapabilities = [
  {
    label: "01",
    title: "Organizational Discovery",
    description:
      "Build a structured understanding of the company, its operating model, strategic priorities, processes, and challenges.",
  },
  {
    label: "02",
    title: "Corporate Intelligence",
    description:
      "Transform organizational knowledge into an enterprise intelligence layer that supports faster and better-informed decisions.",
  },
  {
    label: "03",
    title: "Executive Command",
    description:
      "Give leadership a unified view of performance, priorities, risks, decisions, and transformation progress.",
  },
  {
    label: "04",
    title: "AI Digital Workforce",
    description:
      "Deploy role-based AI capabilities that support teams with analysis, coordination, recommendations, and execution.",
  },
  {
    label: "05",
    title: "Decision Support",
    description:
      "Connect evidence, strategic context, operational signals, and recommendations into clear executive decision briefs.",
  },
  {
    label: "06",
    title: "Continuous Transformation",
    description:
      "Maintain a living transformation environment that evolves as the business, its data, and its priorities change.",
  },
];

const platformLayers = [
  {
    title: "Enterprise Context",
    description:
      "The foundation that captures the company profile, corporate DNA, operating model, goals, and strategic environment.",
  },
  {
    title: "Corporate Brain",
    description:
      "A connected intelligence layer that organizes knowledge, surfaces relationships, and supports enterprise reasoning.",
  },
  {
    title: "Executive Experience",
    description:
      "A leadership interface for reports, priorities, risks, recommendations, decisions, and enterprise visibility.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <SectionHero
        eyebrow="The KAFU AI Platform"
        title="Enterprise intelligence built around how your organization actually operates."
        description="KAFU AI brings organizational understanding, executive insight, corporate knowledge, and AI-enabled execution into one connected enterprise platform."
        primaryLabel="Book an Executive Demo"
        primaryHref="/contact"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />

      <ContentSection
        eyebrow="Platform Capabilities"
        title="From fragmented information to connected enterprise intelligence."
        description="The platform creates a structured operating environment where leadership and teams can understand the organization, identify priorities, and move from insight to coordinated action."
        tone="muted"
      >
        <FeatureGrid items={platformCapabilities} columns={3} />
      </ContentSection>

      <ContentSection
        eyebrow="Platform Architecture"
        title="Three connected layers. One enterprise operating experience."
        description="Each layer contributes to a continuously improving understanding of the company and its transformation priorities."
      >
        <FeatureGrid items={platformLayers} columns={3} />
      </ContentSection>

      <SectionCTA
        eyebrow="See the Platform in Context"
        title="Experience how KAFU AI turns enterprise complexity into executive clarity."
        description="Our executive demo follows a real organizational journey from discovery and assessment to intelligence, decision support, and execution."
        primaryLabel="Request a Demo"
        primaryHref="/contact"
        secondaryLabel="Enterprise Readiness"
        secondaryHref="/enterprise"
      />
    </>
  );
}