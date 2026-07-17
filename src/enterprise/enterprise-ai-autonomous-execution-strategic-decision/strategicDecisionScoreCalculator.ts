import { StrategicDecision } from "./strategicDecision";
import { StrategicDecisionIntelligenceContext } from "./strategicDecisionContext";

export interface StrategicDecisionScore {
  strategicAlignmentScore: number;
  financialValueScore: number;
  executionFeasibilityScore: number;
  riskAdjustedScore: number;
  urgencyScore: number;
  confidenceScore: number;
  totalScore: number;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateStrategicAlignmentScore(
  decision: StrategicDecision,
  context: StrategicDecisionIntelligenceContext,
): number {
  const priorities = context.strategicPriorities ?? [];

  if (priorities.length === 0) {
    return 65;
  }

  const searchableDecisionText = [
    decision.title,
    decision.description,
    decision.strategicObjective,
    decision.expectedOutcome,
  ]
    .join(" ")
    .toLowerCase();

  const matchedPriorities = priorities.filter((priority) =>
    searchableDecisionText.includes(priority.toLowerCase()),
  ).length;

  return clampScore(55 + (matchedPriorities / priorities.length) * 45);
}

function calculateFinancialValueScore(decision: StrategicDecision): number {
  const value = decision.estimatedValue ?? 0;
  const cost = decision.estimatedCost ?? 0;

  if (value <= 0 && cost <= 0) {
    return 55;
  }

  if (cost <= 0 && value > 0) {
    return 95;
  }

  const returnRatio = value / cost;

  return clampScore(35 + returnRatio * 25);
}

function calculateExecutionFeasibilityScore(
  decision: StrategicDecision,
  context: StrategicDecisionIntelligenceContext,
): number {
  const availableCapacity =
    context.execution.availableCapacityPercentage ?? 50;

  const availableBudget = context.execution.availableBudget ?? 0;
  const estimatedCost = decision.estimatedCost ?? 0;

  const budgetScore =
    estimatedCost <= 0
      ? 75
      : availableBudget >= estimatedCost
        ? 100
        : availableBudget > 0
          ? (availableBudget / estimatedCost) * 100
          : 20;

  const dependencyPenalty = Math.min(decision.dependencies.length * 5, 25);
  const constraintPenalty = Math.min(decision.constraints.length * 6, 30);

  return clampScore(
    availableCapacity * 0.45 +
      budgetScore * 0.45 +
      20 -
      dependencyPenalty -
      constraintPenalty,
  );
}

function calculateRiskAdjustedScore(decision: StrategicDecision): number {
  if (decision.risks.length === 0) {
    return 85;
  }

  const averageRisk =
    decision.risks.reduce(
      (total, risk) => total + risk.probability * risk.impact,
      0,
    ) / decision.risks.length;

  return clampScore(100 - averageRisk);
}

function calculateUrgencyScore(decision: StrategicDecision): number {
  const priorityScores = {
    critical: 100,
    high: 82,
    medium: 62,
    low: 40,
  };

  const horizonScores = {
    immediate: 100,
    "short-term": 82,
    "medium-term": 62,
    "long-term": 45,
  };

  return clampScore(
    priorityScores[decision.priority] * 0.6 +
      horizonScores[decision.timeHorizon] * 0.4,
  );
}

function calculateConfidenceScore(decision: StrategicDecision): number {
  const confidenceScores = {
    "very-high": 100,
    high: 85,
    moderate: 65,
    low: 40,
  };

  return confidenceScores[decision.confidence];
}

export function calculateStrategicDecisionScore(
  decision: StrategicDecision,
  context: StrategicDecisionIntelligenceContext,
): StrategicDecisionScore {
  const strategicAlignmentScore = calculateStrategicAlignmentScore(
    decision,
    context,
  );

  const financialValueScore = calculateFinancialValueScore(decision);

  const executionFeasibilityScore = calculateExecutionFeasibilityScore(
    decision,
    context,
  );

  const riskAdjustedScore = calculateRiskAdjustedScore(decision);
  const urgencyScore = calculateUrgencyScore(decision);
  const confidenceScore = calculateConfidenceScore(decision);

  const totalScore = clampScore(
    strategicAlignmentScore * 0.25 +
      financialValueScore * 0.2 +
      executionFeasibilityScore * 0.2 +
      riskAdjustedScore * 0.15 +
      urgencyScore * 0.1 +
      confidenceScore * 0.1,
  );

  return {
    strategicAlignmentScore,
    financialValueScore,
    executionFeasibilityScore,
    riskAdjustedScore,
    urgencyScore,
    confidenceScore,
    totalScore,
  };
}
