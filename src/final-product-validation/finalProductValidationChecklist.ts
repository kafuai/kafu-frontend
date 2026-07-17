import type {
  FinalProductValidationRequirement,
} from "./finalProductValidationTypes";

export const FINAL_PRODUCT_VALIDATION_CHECKLIST: readonly FinalProductValidationRequirement[] =
  [
    {
      id: "engineering-build",
      title: "Production build",
      description: "The optimized production build completes successfully.",
      category: "engineering",
      severity: "critical",
      required: true,
      minimumScore: 100,
    },
    {
      id: "engineering-typescript",
      title: "TypeScript validation",
      description: "The project has no TypeScript compilation errors.",
      category: "engineering",
      severity: "critical",
      required: true,
      minimumScore: 100,
    },
    {
      id: "engineering-eslint",
      title: "ESLint validation",
      description: "The project has no ESLint errors or warnings.",
      category: "engineering",
      severity: "high",
      required: true,
      minimumScore: 100,
    },
    {
      id: "architecture-enterprise",
      title: "Enterprise architecture completeness",
      description:
        "Core enterprise layers are complete, connected, and release-safe.",
      category: "architecture",
      severity: "critical",
      required: true,
      minimumScore: 90,
    },
    {
      id: "architecture-feature-freeze",
      title: "Feature freeze compliance",
      description:
        "No unapproved feature work is included in the release candidate.",
      category: "architecture",
      severity: "high",
      required: true,
      minimumScore: 100,
    },
    {
      id: "product-core-flows",
      title: "Core product flows",
      description:
        "Primary customer and executive workflows are complete and usable.",
      category: "product",
      severity: "critical",
      required: true,
      minimumScore: 90,
    },
    {
      id: "product-data-integrity",
      title: "Product data integrity",
      description:
        "Displayed data, calculations, statuses, and decisions are consistent.",
      category: "product",
      severity: "critical",
      required: true,
      minimumScore: 90,
    },
    {
      id: "experience-visual-identity",
      title: "Visual identity consistency",
      description:
        "Brand, typography, spacing, colors, and components are consistent.",
      category: "experience",
      severity: "high",
      required: true,
      minimumScore: 90,
    },
    {
      id: "experience-responsive",
      title: "Responsive experience",
      description:
        "Critical pages remain usable across supported screen sizes.",
      category: "experience",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "experience-accessibility",
      title: "Accessibility baseline",
      description:
        "Critical interfaces meet the agreed accessibility baseline.",
      category: "experience",
      severity: "medium",
      required: true,
      minimumScore: 80,
    },
    {
      id: "security-secrets",
      title: "Secrets and environment safety",
      description:
        "No private credentials are exposed in source code or the client.",
      category: "security",
      severity: "critical",
      required: true,
      minimumScore: 100,
    },
    {
      id: "security-input-boundaries",
      title: "Input and trust boundaries",
      description:
        "User-controlled inputs and external data have safe validation.",
      category: "security",
      severity: "high",
      required: true,
      minimumScore: 90,
    },
    {
      id: "operations-error-states",
      title: "Error and empty states",
      description:
        "Critical flows include understandable loading, empty, and error states.",
      category: "operations",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "operations-release-process",
      title: "Release process",
      description:
        "Versioning, release notes, rollback, and deployment steps are defined.",
      category: "operations",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "operations-documentation",
      title: "Operational documentation",
      description:
        "Setup, environment, deployment, and support documentation are usable.",
      category: "operations",
      severity: "medium",
      required: true,
      minimumScore: 80,
    },
    {
      id: "commercial-demo",
      title: "Executive demo readiness",
      description:
        "The executive demo is stable and deliverable within 15 to 20 minutes.",
      category: "commercial",
      severity: "critical",
      required: true,
      minimumScore: 90,
    },
    {
      id: "commercial-pricing",
      title: "Pricing readiness",
      description:
        "Pricing structure, packaging, and commercial assumptions are approved.",
      category: "commercial",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "commercial-pilot",
      title: "Pilot proposal readiness",
      description:
        "Pilot scope, success metrics, duration, and commercial terms are defined.",
      category: "commercial",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "go-to-market-landing-page",
      title: "Landing page readiness",
      description:
        "The public landing page clearly communicates value and conversion paths.",
      category: "go-to-market",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "go-to-market-sales-assets",
      title: "Sales assets readiness",
      description:
        "Executive pitch, product narrative, and supporting sales assets are ready.",
      category: "go-to-market",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
    {
      id: "go-to-market-onboarding",
      title: "Customer onboarding readiness",
      description:
        "The first customer onboarding process and responsibilities are defined.",
      category: "go-to-market",
      severity: "high",
      required: true,
      minimumScore: 85,
    },
  ] as const;
