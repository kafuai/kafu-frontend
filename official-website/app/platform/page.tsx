import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Enterprise AI Platform | KAFU AI",
  description:
    "Explore the KAFU AI enterprise intelligence platform for organizational knowledge, executive decisions, governed AI adoption, and coordinated execution.",
};

const platformCapabilities = [
  {
    label: "01",
    title: "Organizational Discovery",
    description:
      "Build a structured understanding of the organization, its operating model, priorities, processes, challenges, and transformation opportunities.",
  },
  {
    label: "02",
    title: "Corporate Intelligence",
    description:
      "Turn institutional knowledge and business context into a connected intelligence environment that supports clearer decisions.",
  },
  {
    label: "03",
    title: "Executive Command",
    description:
      "Give leadership one view of strategic priorities, risks, decisions, responsible owners, and measurable progress.",
  },
  {
    label: "04",
    title: "AI Digital Workforce",
    description:
      "Coordinate role-based AI capabilities around approved responsibilities, defined workflows, and measurable business outcomes.",
  },
  {
    label: "05",
    title: "Decision Intelligence",
    description:
      "Connect evidence, organizational context, operational signals, risks, and recommendations into decision-ready executive views.",
  },
  {
    label: "06",
    title: "Continuous Transformation",
    description:
      "Maintain a living transformation environment that evolves as the organization, its knowledge, and its priorities change.",
  },
];

const platformLayers = [
  {
    title: "Enterprise Context",
    description:
      "Captures the organization’s identity, operating model, strategic priorities, challenges, and decision environment.",
  },
  {
    title: "Corporate Brain",
    description:
      "Organizes institutional knowledge, connects relationships, preserves context, and supports enterprise reasoning.",
  },
  {
    title: "Executive Experience",
    description:
      "Provides leadership with clear priorities, risks, recommendations, decisions, ownership, and visible progress.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <SectionHero
        eyebrow="The KAFU AI Platform"
        title="One enterprise intelligence platform from knowledge to execution."
        description="KAFU AI connects organizational context, institutional knowledge, executive decisions, and coordinated execution in one governed operating environment."
        primaryLabel="Book an Executive Demo"
        primaryHref="/book-demo"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />

      <ContentSection
        eyebrow="Platform Capabilities"
        title="Turn fragmented organizational information into executive clarity."
        description="KAFU AI creates a connected environment where leadership can understand the organization, identify what requires attention, make informed decisions, and coordinate execution."
        tone="muted"
      >
        <FeatureGrid items={platformCapabilities} columns={3} />
      </ContentSection>

      <ContentSection
        eyebrow="Platform Architecture"
        title="Three connected layers. One enterprise operating experience."
        description="Each layer strengthens the organization’s ability to preserve knowledge, understand context, support decisions, and turn priorities into measurable action."
      >
        <FeatureGrid items={platformLayers} columns={3} />
      </ContentSection>

      <SectionCTA
        eyebrow="See the Platform in Context"
        title="Discover where KAFU AI can create the greatest value in your organization."
        description="Our executive demo follows a practical organizational journey from discovery and institutional knowledge to decision intelligence and governed execution."
        primaryLabel="Book an Executive Demo"
        primaryHref="/book-demo"
        secondaryLabel="Explore Enterprise Readiness"
        secondaryHref="/enterprise"
      />
    </>
  );
}