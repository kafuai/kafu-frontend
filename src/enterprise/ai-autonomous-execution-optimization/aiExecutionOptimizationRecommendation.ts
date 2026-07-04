import { AIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationOpportunity";
import { AIExecutionOptimizationScore } from "./aiExecutionOptimizationScoring";
import { scoreAIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationScoring";

export interface AIExecutionOptimizationRecommendation {
  opportunityId: string;
  score: AIExecutionOptimizationScore;
  actions: string[];
  expectedBenefits: string[];
}

export function createAIExecutionOptimizationRecommendation(
  opportunity: AIExecutionOptimizationOpportunity,
): AIExecutionOptimizationRecommendation {
  return {
    opportunityId: opportunity.id,
    score: scoreAIExecutionOptimizationOpportunity(opportunity),
    actions: buildActions(opportunity),
    expectedBenefits: buildBenefits(opportunity),
  };
}

function buildActions(
  opportunity: AIExecutionOptimizationOpportunity,
): string[] {
  switch (opportunity.type) {
    case "performance":
      return [
        "Optimize execution pipeline.",
        "Reduce processing latency.",
        "Improve scheduling efficiency.",
      ];

    case "reliability":
      return [
        "Increase retry resilience.",
        "Review failure handling.",
        "Strengthen execution validation.",
      ];

    case "cost":
      return [
        "Reduce unnecessary execution cost.",
        "Optimize resource allocation.",
      ];

    case "capacity":
      return [
        "Increase execution capacity.",
        "Balance workload distribution.",
      ];

    case "sla_protection":
      return [
        "Prioritize SLA-sensitive executions.",
        "Escalate high-risk workloads.",
      ];

    default:
      return [
        "Review execution stability.",
        "Apply optimization best practices.",
      ];
  }
}

function buildBenefits(
  opportunity: AIExecutionOptimizationOpportunity,
): string[] {
  return [
    `Performance Gain: ${Math.round(opportunity.impact.performanceGain * 100)}%`,
    `Reliability Gain: ${Math.round(opportunity.impact.reliabilityGain * 100)}%`,
    `Cost Reduction: ${Math.round(opportunity.impact.costReduction * 100)}%`,
    `SLA Protection: ${Math.round(opportunity.impact.slaProtection * 100)}%`,
  ];
}