import {
  ExecutiveDemoDecisionBriefingContext,
} from "./executiveDemoDecisionBriefingContext";
import {
  ExecutiveDecisionBriefingAction,
  ExecutiveDecisionBriefingOption,
} from "./executiveDemoDecisionBriefingTypes";

export interface ExecutiveDecisionRecommendationInput {
  context: ExecutiveDemoDecisionBriefingContext;
  primaryObjective: string;
  transformationScope: string;
  preferredApproach?: string;
  decisionOwner?: string;
}

export interface ExecutiveDecisionRecommendation {
  recommendedDecision: string;
  rationale: string;
  options: ExecutiveDecisionBriefingOption[];
  actions: ExecutiveDecisionBriefingAction[];
}

function buildOptions(
  input: ExecutiveDecisionRecommendationInput,
): ExecutiveDecisionBriefingOption[] {
  return [
    {
      id: "option-accelerated",
      title: "Accelerated execution",
      summary:
        `Proceed with an accelerated implementation of ${input.transformationScope}.`,
      advantages: [
        "Faster realization of business value",
        "Earlier executive visibility",
        "Rapid operational learning",
      ],
      tradeoffs: [
        "Higher near-term delivery pressure",
        "Requires strong executive sponsorship",
      ],
      estimatedImpact: "High strategic and operational impact",
      recommended: true,
    },
    {
      id: "option-phased",
      title: "Phased execution",
      summary:
        `Implement ${input.transformationScope} through controlled phases.`,
      advantages: [
        "Lower execution risk",
        "More time for organizational adoption",
      ],
      tradeoffs: [
        "Slower value realization",
        "Longer executive decision cycle",
      ],
      estimatedImpact: "Moderate impact with reduced execution risk",
      recommended: false,
    },
    {
      id: "option-defer",
      title: "Defer execution",
      summary:
        `Postpone ${input.transformationScope} until additional readiness is established.`,
      advantages: [
        "Avoids immediate resource pressure",
        "Allows further planning",
      ],
      tradeoffs: [
        "Delays business value",
        "May increase competitive and operational risk",
      ],
      estimatedImpact: "Low immediate impact with higher opportunity cost",
      recommended: false,
    },
  ];
}

function buildActions(
  input: ExecutiveDecisionRecommendationInput,
): ExecutiveDecisionBriefingAction[] {
  return [
    {
      id: "action-approval",
      title: "Confirm executive approval",
      description:
        `Approve the preferred approach for ${input.primaryObjective}.`,
      owner: input.decisionOwner ?? "Executive Sponsor",
      priority: input.context.decisionUrgency,
    },
    {
      id: "action-scope",
      title: "Validate execution scope",
      description:
        `Confirm the initial scope and success criteria for ${input.transformationScope}.`,
      owner: "Transformation Lead",
      priority: "high",
    },
    {
      id: "action-governance",
      title: "Activate governance",
      description:
        "Establish decision rights, reporting cadence, and executive oversight.",
      owner: "Program Governance",
      priority: "high",
    },
  ];
}

export function generateExecutiveDecisionRecommendation(
  input: ExecutiveDecisionRecommendationInput,
): ExecutiveDecisionRecommendation {
  const approach =
    input.preferredApproach?.trim() || "accelerated enterprise execution";

  return {
    recommendedDecision:
      `Approve ${approach} for ${input.transformationScope} in support of ` +
      `${input.primaryObjective}.`,
    rationale:
      `${input.context.companyName} has ${input.context.decisionUrgency} decision urgency ` +
      `with ${input.context.confidence} confidence. The recommended approach ` +
      `prioritizes ${input.context.primaryImpactAreas.join(", ")}.`,
    options: buildOptions(input),
    actions: buildActions(input),
  };
}
