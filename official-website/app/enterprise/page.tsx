import type { Metadata } from "next";

import ContentSection from "@/components/shared/ContentSection";
import FeatureGrid from "@/components/shared/FeatureGrid";
import SectionCTA from "@/components/shared/SectionCTA";
import SectionHero from "@/components/shared/SectionHero";

export const metadata: Metadata = {
  title: "Enterprise AI Readiness | KAFU AI",
  description:
    "Discover how KAFU AI enables governed enterprise AI adoption through organizational context, executive oversight, security and scalable transformation.",
};

const enterprisePrinciples = [
  {
    title: "Enterprise Governance",
    description:
      "Establish clear ownership, defined responsibilities, controlled access and executive oversight across the AI operating environment.",
  },
  {
    title: "Responsible AI Adoption",
    description:
      "Introduce AI through business priorities, human accountability, governance processes and measurable organizational outcomes.",
  },
  {
    title: "Security by Design",
    description:
      "Protect enterprise knowledge through secure architecture, managed environments and enterprise-grade operating practices.",
  },
  {
    title: "Organizational Context",
    description:
      "Ensure every recommendation reflects the organization’s priorities, operating model, approved knowledge and business objectives.",
  },
  {
    title: "Scalable Enterprise Architecture",
    description:
      "Expand AI adoption progressively across departments, business units and use cases without losing governance or operational consistency.",
  },
  {
    title: "Human-Centered Execution",
    description:
      "Support leadership and employees with AI while executive authority, approvals and accountability always remain with people.",
  },
];

const adoptionModel = [
  {
    label: "Stage 1",
    title: "Discover",
    description:
      "Understand executive priorities, organizational context, operating challenges and transformation objectives.",
  },
  {
    label: "Stage 2",
    title: "Activate",
    description:
      "Deploy the platform with the right knowledge sources, governance model, executive experiences and AI capabilities.",
  },
  {
    label: "Stage 3",
    title: "Scale",
    description:
      "Expand confidently across teams and business units using measurable outcomes and controlled governance.",
  },
];

export default function EnterprisePage() {
  return (
    <>
      <SectionHero
        eyebrow="Enterprise Readiness"
        title="Enterprise AI built for governance, trust and long-term adoption."
        description="KAFU AI combines organizational context, executive oversight, secure governance and scalable adoption into one enterprise operating platform."
        primaryLabel="Book an Executive Discovery"
        primaryHref="/book-demo"
        secondaryLabel="Explore the Platform"
        secondaryHref="/platform"
      />

      <ContentSection
        eyebrow="Enterprise Principles"
        title="The foundation for responsible enterprise AI."
        description="Long-term AI success depends on governance, organizational context, executive accountability and a disciplined operating model—not technology alone."
        tone="muted"
      >
        <FeatureGrid items={enterprisePrinciples} columns={3} />
      </ContentSection>

      <ContentSection
        eyebrow="Adoption Journey"
        title="From executive alignment to enterprise-wide adoption."
        description="KAFU AI supports a phased implementation approach that reduces risk while creating measurable business value."
      >
        <FeatureGrid items={adoptionModel} columns={3} />
      </ContentSection>

      <SectionCTA
        eyebrow="Executive Discovery"
        title="Plan a practical AI adoption roadmap for your organization."
        description="Meet with our team to evaluate your priorities, governance requirements and highest-value opportunities before expanding AI across the enterprise."
        primaryLabel="Book Executive Discovery"
        primaryHref="/book-demo"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />
    </>
  );
}