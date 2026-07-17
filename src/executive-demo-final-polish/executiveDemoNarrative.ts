import type {
  ExecutiveDemoAgenda,
} from "./executiveDemoFinalPolishTypes";

export const EXECUTIVE_DEMO_AGENDA: ExecutiveDemoAgenda = {
  title: "KAFU AI Executive Demo",
  totalMinutes: 18,
  checkpoints: [
    {
      id: "demo-opening",
      title: "Executive Opening",
      stage: "opening",
      objective:
        "Establish the business context and position KAFU AI as an enterprise intelligence and execution platform.",
      expectedOutcome:
        "The audience understands the strategic promise before seeing the product.",
      estimatedMinutes: 1,
      priority: "critical",
    },
    {
      id: "demo-problem",
      title: "The Enterprise Problem",
      stage: "problem",
      objective:
        "Explain the fragmentation between data, decisions, people, and execution.",
      expectedOutcome:
        "The audience recognizes the operational and strategic problem KAFU AI solves.",
      estimatedMinutes: 1,
      priority: "critical",
    },
    {
      id: "demo-discovery",
      title: "Business Discovery",
      stage: "discovery",
      objective:
        "Show how KAFU AI captures business context, challenges, priorities, and organizational inputs.",
      expectedOutcome:
        "The audience sees that recommendations are grounded in real company context.",
      estimatedMinutes: 2,
      priority: "high",
    },
    {
      id: "demo-assessment",
      title: "Organizational Assessment",
      stage: "assessment",
      objective:
        "Demonstrate how organizational readiness and transformation maturity are assessed.",
      expectedOutcome:
        "The audience understands how KAFU AI identifies gaps and readiness levels.",
      estimatedMinutes: 2,
      priority: "high",
    },
    {
      id: "demo-intelligence",
      title: "Enterprise Intelligence",
      stage: "intelligence",
      objective:
        "Show how company data is transformed into structured enterprise intelligence.",
      expectedOutcome:
        "The audience sees how KAFU AI reasons across the organization.",
      estimatedMinutes: 2,
      priority: "critical",
    },
    {
      id: "demo-recommendation",
      title: "AI Recommendations",
      stage: "recommendation",
      objective:
        "Present prioritized decisions, recommendations, and transformation actions.",
      expectedOutcome:
        "The audience understands that KAFU AI moves beyond reporting into decision support.",
      estimatedMinutes: 2,
      priority: "critical",
    },
    {
      id: "demo-executive-summary",
      title: "Executive Summary",
      stage: "executive-summary",
      objective:
        "Present the executive view of risks, priorities, opportunities, and recommended action.",
      expectedOutcome:
        "Senior leaders can understand the organization quickly and act with confidence.",
      estimatedMinutes: 2,
      priority: "critical",
    },
    {
      id: "demo-command-center",
      title: "Command Center",
      stage: "command-center",
      objective:
        "Demonstrate how decisions, actions, deadlines, ownership, and execution are monitored.",
      expectedOutcome:
        "The audience sees how strategic recommendations become managed execution.",
      estimatedMinutes: 2,
      priority: "critical",
    },
    {
      id: "demo-digital-workforce",
      title: "Digital Workforce",
      stage: "digital-workforce",
      objective:
        "Explain how AI roles support leaders and employees across business functions.",
      expectedOutcome:
        "The audience understands the future operating model enabled by KAFU AI.",
      estimatedMinutes: 2,
      priority: "high",
    },
    {
      id: "demo-closing",
      title: "Business Value & Closing",
      stage: "closing",
      objective:
        "Summarize the strategic value and define the path toward a controlled pilot.",
      expectedOutcome:
        "The audience understands the business case and the proposed next step.",
      estimatedMinutes: 1,
      priority: "critical",
    },
    {
      id: "demo-questions",
      title: "Questions",
      stage: "questions",
      objective:
        "Address executive questions without disrupting the core narrative.",
      expectedOutcome:
        "The meeting closes with clarity, confidence, and an agreed follow-up.",
      estimatedMinutes: 1,
      priority: "medium",
    },
  ],
};

export const EXECUTIVE_DEMO_OPENING =
  "Most organizations do not suffer from a lack of data. They suffer from disconnected knowledge, slow decisions, unclear ownership, and inconsistent execution. KAFU AI connects these elements into one intelligent operating environment.";

export const EXECUTIVE_DEMO_CLOSING =
  "KAFU AI gives leadership a living understanding of the organization, converts that understanding into prioritized decisions, and connects those decisions directly to execution. The recommended next step is a controlled pilot with clear success measures.";
