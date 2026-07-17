import type {
  ExecutiveDemoTransition,
} from "./executiveDemoFinalPolishTypes";

export const EXECUTIVE_DEMO_FLOW: readonly ExecutiveDemoTransition[] = [
  {
    from: "opening",
    to: "problem",
    message:
      "Before showing the platform, let us first define the enterprise problem it was built to solve.",
  },
  {
    from: "problem",
    to: "discovery",
    message:
      "KAFU AI starts by understanding the organization rather than producing generic recommendations.",
  },
  {
    from: "discovery",
    to: "assessment",
    message:
      "Once the business context is captured, KAFU AI evaluates organizational readiness and transformation maturity.",
  },
  {
    from: "assessment",
    to: "intelligence",
    message:
      "The assessment becomes the foundation for a structured enterprise intelligence model.",
  },
  {
    from: "intelligence",
    to: "recommendation",
    message:
      "Enterprise intelligence becomes valuable when it leads to clear and prioritized decisions.",
  },
  {
    from: "recommendation",
    to: "executive-summary",
    message:
      "Those recommendations are then translated into an executive view designed for leadership action.",
  },
  {
    from: "executive-summary",
    to: "command-center",
    message:
      "KAFU AI does not stop at insight; it connects every decision to ownership, deadlines, and execution.",
  },
  {
    from: "command-center",
    to: "digital-workforce",
    message:
      "Execution can then be supported by specialized AI roles working across the organization.",
  },
  {
    from: "digital-workforce",
    to: "closing",
    message:
      "Together, these capabilities create a new operating model for enterprise intelligence and execution.",
  },
  {
    from: "closing",
    to: "questions",
    message:
      "With the business value established, we can now address the areas most relevant to your organization.",
  },
];
