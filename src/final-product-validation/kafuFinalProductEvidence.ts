import type {
  FinalProductValidationEvidence,
} from "./finalProductValidationTypes";

export const KAFU_FINAL_PRODUCT_EVIDENCE: readonly FinalProductValidationEvidence[] =
  [
    {
      requirementId: "engineering-build",
      status: "passed",
      score: 100,
      evidence: "Next.js optimized production build completed successfully.",
      notes: "Release Candidate v0.1.0-rc.2 build is successful.",
    },
    {
      requirementId: "engineering-typescript",
      status: "passed",
      score: 100,
      evidence: "TypeScript compilation completed with zero errors.",
    },
    {
      requirementId: "engineering-eslint",
      status: "passed",
      score: 100,
      evidence: "ESLint completed with zero errors and zero warnings.",
    },
    {
      requirementId: "architecture-enterprise",
      status: "passed",
      score: 96,
      evidence:
        "Frontend and enterprise architecture layers are complete and integrated.",
    },
    {
      requirementId: "architecture-feature-freeze",
      status: "passed",
      score: 100,
      evidence:
        "Feature Freeze policy activated after Release Candidate publication.",
    },
    {
      requirementId: "product-core-flows",
      status: "passed",
      score: 92,
      evidence:
        "Primary executive, dashboard, assessment, discovery, and workspace flows are implemented.",
    },
    {
      requirementId: "product-data-integrity",
      status: "passed",
      score: 90,
      evidence:
        "Core product calculations, statuses, and enterprise outputs compile and operate consistently.",
    },
    {
      requirementId: "experience-visual-identity",
      status: "pending",
      score: 82,
      evidence:
        "Visual identity exists but requires final cross-page consistency validation.",
      notes:
        "Complete the final visual consistency pass before production approval.",
    },
    {
      requirementId: "experience-responsive",
      status: "pending",
      score: 80,
      evidence:
        "Responsive layouts exist but require final device-level verification.",
    },
    {
      requirementId: "experience-accessibility",
      status: "pending",
      score: 75,
      evidence:
        "Accessibility baseline requires final keyboard, contrast, and semantic review.",
    },
    {
      requirementId: "security-secrets",
      status: "passed",
      score: 100,
      evidence:
        "Environment configuration is separated through local environment variables.",
    },
    {
      requirementId: "security-input-boundaries",
      status: "pending",
      score: 82,
      evidence:
        "Input boundaries require final production-oriented validation review.",
    },
    {
      requirementId: "operations-error-states",
      status: "pending",
      score: 80,
      evidence:
        "Critical empty, loading, and failure states require a final product-wide pass.",
    },
    {
      requirementId: "operations-release-process",
      status: "passed",
      score: 90,
      evidence:
        "Release Candidate is versioned, committed, and published to GitHub.",
    },
    {
      requirementId: "operations-documentation",
      status: "pending",
      score: 75,
      evidence:
        "Deployment, operational, support, and customer-facing documentation remain incomplete.",
    },
    {
      requirementId: "commercial-demo",
      status: "passed",
      score: 90,
      evidence:
        "The core Executive Demo experience is implemented and operational.",
      notes:
        "Final narrative timing and presentation polish remain part of the next phase.",
    },
    {
      requirementId: "commercial-pricing",
      status: "pending",
      score: 0,
      evidence: "Pricing and packaging have not yet received final approval.",
    },
    {
      requirementId: "commercial-pilot",
      status: "pending",
      score: 0,
      evidence: "The customer Pilot Proposal remains to be completed.",
    },
    {
      requirementId: "go-to-market-landing-page",
      status: "pending",
      score: 0,
      evidence: "The production-grade public Landing Page remains to be completed.",
    },
    {
      requirementId: "go-to-market-sales-assets",
      status: "pending",
      score: 35,
      evidence:
        "The core Executive Demo exists, but Executive Pitch and final sales assets remain incomplete.",
    },
    {
      requirementId: "go-to-market-onboarding",
      status: "pending",
      score: 0,
      evidence: "The first-customer onboarding journey remains to be defined.",
    },
  ] as const;
