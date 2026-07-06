import {
  AIRecommendationAction,
  AIRecommendationItem,
  AIRecommendationResult,
} from "../models/aiRecommendationModel";
import {
  AIRecommendationContext,
  AIRecommendationSignal,
} from "../types/aiRecommendationTypes";
import { evaluateAIRecommendationPolicy } from "./aiRecommendationPolicy";
import { calculateAIRecommendationScore } from "./aiRecommendationScoring";
import { selectTopAIRecommendationSignals } from "./aiRecommendationSelector";

export function generateAIRecommendations(
  context: AIRecommendationContext,
): AIRecommendationResult {
  const policy = evaluateAIRecommendationPolicy(context);

  if (!policy.allowed) {
    throw new Error(`AI recommendation policy failed: ${policy.reasons.join(" ")}`);
  }

  const selectedSignals = selectTopAIRecommendationSignals(context.signals);

  const recommendations = selectedSignals.map((signal) =>
    createRecommendationFromSignal(context, signal),
  );

  return {
    id: `${context.organizationId}-ai-recommendations-${Date.now()}`,
    organizationId: context.organizationId,
    objective: context.objective,
    recommendations,
    summary: buildAIRecommendationSummary(context, recommendations),
    generatedAt: context.generatedAt ?? new Date(),
  };
}

function createRecommendationFromSignal(
  context: AIRecommendationContext,
  signal: AIRecommendationSignal,
): AIRecommendationItem {
  const score = calculateAIRecommendationScore(signal);

  return {
    id: `${context.organizationId}-recommendation-${signal.id}`,
    organizationId: context.organizationId,
    domain: signal.domain,
    title: buildRecommendationTitle(signal),
    rationale: buildRecommendationRationale(signal),
    priority: signal.priority,
    confidence: signal.confidence,
    score,
    actions: buildRecommendationActions(signal),
    expectedBusinessImpact: buildExpectedBusinessImpact(signal),
    risks: buildRecommendationRisks(signal),
  };
}

function buildRecommendationTitle(signal: AIRecommendationSignal): string {
  switch (signal.type) {
    case "opportunity":
      return `Capture opportunity: ${signal.title}`;
    case "risk":
      return `Mitigate risk: ${signal.title}`;
    case "inefficiency":
      return `Improve efficiency: ${signal.title}`;
    case "constraint":
      return `Remove constraint: ${signal.title}`;
    case "performance_gap":
      return `Close performance gap: ${signal.title}`;
    case "alignment_gap":
      return `Improve alignment: ${signal.title}`;
    case "decision_support":
      return `Support decision: ${signal.title}`;
    default:
      return `Recommendation: ${signal.title}`;
  }
}

function buildRecommendationRationale(signal: AIRecommendationSignal): string {
  return `${signal.description} This recommendation is prioritized based on impact, urgency, priority, and confidence.`;
}

function buildRecommendationActions(
  signal: AIRecommendationSignal,
): AIRecommendationAction[] {
  return [
    {
      id: `${signal.id}-action-assess`,
      title: "Assess current state",
      description:
        "Review the signal context, affected stakeholders, dependencies, and current operational baseline.",
      ownerRole: "Business Owner",
      expectedOutcome: "Clear understanding of the current state and root cause.",
      priority: signal.priority,
    },
    {
      id: `${signal.id}-action-plan`,
      title: "Define execution plan",
      description:
        "Create a practical execution plan with owners, timeline, success metrics, and governance checkpoints.",
      ownerRole: "Execution Lead",
      expectedOutcome: "Actionable execution path aligned with the business objective.",
      priority: signal.priority,
    },
    {
      id: `${signal.id}-action-measure`,
      title: "Measure recommendation impact",
      description:
        "Track implementation progress, measure outcomes, and adjust actions based on observed results.",
      ownerRole: "Performance Owner",
      expectedOutcome: "Measured business impact and continuous improvement feedback.",
      priority: signal.priority,
    },
  ];
}

function buildExpectedBusinessImpact(signal: AIRecommendationSignal): string {
  switch (signal.domain) {
    case "strategy":
      return "Stronger strategic alignment and better executive decision quality.";
    case "operations":
      return "Improved operational throughput, clarity, and execution reliability.";
    case "risk":
      return "Reduced exposure and stronger organizational resilience.";
    case "governance":
      return "Improved control, accountability, and decision traceability.";
    case "people":
      return "Better workforce alignment, ownership, and organizational readiness.";
    case "technology":
      return "Improved technology enablement and smarter platform utilization.";
    case "execution":
      return "Faster execution with clearer ownership and measurable outcomes.";
    case "optimization":
      return "Higher efficiency and better use of enterprise resources.";
    default:
      return "Improved enterprise performance and decision quality.";
  }
}

function buildRecommendationRisks(signal: AIRecommendationSignal): string[] {
  const risks = ["Weak ownership may reduce implementation quality."];

  if (signal.confidence === "low") {
    risks.push("Low confidence may require additional validation before execution.");
  }

  if (signal.urgencyScore >= 0.8) {
    risks.push("High urgency may compress analysis and execution planning time.");
  }

  return risks;
}

function buildAIRecommendationSummary(
  context: AIRecommendationContext,
  recommendations: AIRecommendationItem[],
): string {
  return [
    `${recommendations.length} AI recommendations were generated for ${context.objective}.`,
    `The recommendation domain is ${context.domain}.`,
    "Recommendations are ranked using impact, urgency, priority, and confidence.",
  ].join(" ");
}