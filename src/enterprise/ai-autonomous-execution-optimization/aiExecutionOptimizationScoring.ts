import { AIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationOpportunity";

export interface AIExecutionOptimizationScore {
  overall: number;
  impact: number;
  feasibility: number;
  urgency: number;
}

export function scoreAIExecutionOptimizationOpportunity(
  opportunity: AIExecutionOptimizationOpportunity,
): AIExecutionOptimizationScore {
  const impact =
    (opportunity.impact.performanceGain +
      opportunity.impact.reliabilityGain +
      opportunity.impact.costReduction +
      opportunity.impact.slaProtection) /
    4;

  const feasibility =
    opportunity.feasibility.confidence *
    complexityWeight(opportunity.feasibility.implementationComplexity) *
    riskWeight(opportunity.feasibility.operationalRisk);

  const urgency = priorityWeight(opportunity.priority);

  const overall =
    impact * 0.5 +
    feasibility * 0.3 +
    urgency * 0.2;

  return {
    overall: clamp(overall),
    impact: clamp(impact),
    feasibility: clamp(feasibility),
    urgency: clamp(urgency),
  };
}

function priorityWeight(priority: AIExecutionOptimizationOpportunity["priority"]): number {
  switch (priority) {
    case "critical":
      return 1;
    case "high":
      return 0.8;
    case "medium":
      return 0.6;
    default:
      return 0.35;
  }
}

function complexityWeight(level: AIExecutionOptimizationOpportunity["feasibility"]["implementationComplexity"]): number {
  switch (level) {
    case "low":
      return 1;
    case "medium":
      return 0.8;
    case "high":
      return 0.6;
  }
}

function riskWeight(level: AIExecutionOptimizationOpportunity["feasibility"]["operationalRisk"]): number {
  switch (level) {
    case "low":
      return 1;
    case "medium":
      return 0.8;
    case "high":
      return 0.6;
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}