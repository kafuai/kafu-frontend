import { AIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationOpportunity";
import { scoreAIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationScoring";

export interface AIExecutionOptimizationGuardrailResult {
  opportunityId: string;
  allowed: boolean;
  reasons: string[];
}

export interface AIExecutionOptimizationGuardrailPolicy {
  minimumScore?: number;
  minimumConfidence?: number;
  blockHighRisk?: boolean;
  blockHighComplexity?: boolean;
}

export function evaluateAIExecutionOptimizationGuardrails(
  opportunity: AIExecutionOptimizationOpportunity,
  policy: AIExecutionOptimizationGuardrailPolicy = {},
): AIExecutionOptimizationGuardrailResult {
  const minimumScore = policy.minimumScore ?? 0.45;
  const minimumConfidence = policy.minimumConfidence ?? 0.5;
  const reasons: string[] = [];
  const score = scoreAIExecutionOptimizationOpportunity(opportunity);

  if (score.overall < minimumScore) {
    reasons.push(`Optimization score below minimum threshold: ${score.overall}`);
  }

  if (opportunity.feasibility.confidence < minimumConfidence) {
    reasons.push(
      `Optimization confidence below minimum threshold: ${opportunity.feasibility.confidence}`,
    );
  }

  if (policy.blockHighRisk && opportunity.feasibility.operationalRisk === "high") {
    reasons.push("High operational risk is blocked by policy");
  }

  if (
    policy.blockHighComplexity &&
    opportunity.feasibility.implementationComplexity === "high"
  ) {
    reasons.push("High implementation complexity is blocked by policy");
  }

  return {
    opportunityId: opportunity.id,
    allowed: reasons.length === 0,
    reasons,
  };
}

export function filterAllowedAIExecutionOptimizationOpportunities(
  opportunities: AIExecutionOptimizationOpportunity[],
  policy: AIExecutionOptimizationGuardrailPolicy = {},
): AIExecutionOptimizationOpportunity[] {
  return opportunities.filter(
    (opportunity) =>
      evaluateAIExecutionOptimizationGuardrails(opportunity, policy).allowed,
  );
}