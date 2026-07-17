import { StrategicDecision } from "./strategicDecision";
import { StrategicDecisionIntelligenceContext } from "./strategicDecisionContext";

export type StrategicDecisionRiskLevel =
  | "critical"
  | "high"
  | "moderate"
  | "low";

export interface StrategicDecisionRiskAssessment {
  riskLevel: StrategicDecisionRiskLevel;
  aggregateRiskScore: number;
  highestRiskScore: number;
  executionPressureScore: number;
  identifiedRisks: string[];
  recommendedMitigations: string[];
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function resolveRiskLevel(score: number): StrategicDecisionRiskLevel {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 35) {
    return "moderate";
  }

  return "low";
}

export function assessStrategicDecisionRisk(
  decision: StrategicDecision,
  context: StrategicDecisionIntelligenceContext,
): StrategicDecisionRiskAssessment {
  const individualRiskScores = decision.risks.map((risk) =>
    clampScore(risk.probability * risk.impact),
  );

  const aggregateRiskScore =
    individualRiskScores.length > 0
      ? clampScore(
          individualRiskScores.reduce((total, score) => total + score, 0) /
            individualRiskScores.length,
        )
      : 15;

  const highestRiskScore =
    individualRiskScores.length > 0
      ? Math.max(...individualRiskScores)
      : 15;

  const executionPressureScore = clampScore(
    context.execution.delayedInitiatives * 8 +
      context.execution.blockedInitiatives * 12 +
      Math.max(
        0,
        50 - (context.execution.availableCapacityPercentage ?? 50),
      ),
  );

  const combinedRiskScore = clampScore(
    aggregateRiskScore * 0.55 +
      highestRiskScore * 0.25 +
      executionPressureScore * 0.2,
  );

  const identifiedRisks = decision.risks.map((risk) => risk.title);

  if (context.execution.blockedInitiatives > 0) {
    identifiedRisks.push(
      `${context.execution.blockedInitiatives} blocked initiative(s) may constrain execution.`,
    );
  }

  if ((context.execution.availableCapacityPercentage ?? 50) < 30) {
    identifiedRisks.push(
      "Available organizational execution capacity is critically limited.",
    );
  }

  if (
    decision.estimatedCost &&
    context.execution.availableBudget !== null &&
    context.execution.availableBudget !== undefined &&
    decision.estimatedCost > context.execution.availableBudget
  ) {
    identifiedRisks.push(
      "Estimated decision cost exceeds currently available execution budget.",
    );
  }

  const recommendedMitigations = decision.risks
    .map((risk) => risk.mitigation)
    .filter((mitigation): mitigation is string => Boolean(mitigation));

  if (executionPressureScore >= 60) {
    recommendedMitigations.push(
      "Rebalance execution capacity before activating the strategic decision.",
    );
  }

  if (decision.dependencies.length > 3) {
    recommendedMitigations.push(
      "Create a dependency resolution plan with named owners and deadlines.",
    );
  }

  if (decision.constraints.length > 2) {
    recommendedMitigations.push(
      "Escalate key constraints for executive resolution before approval.",
    );
  }

  return {
    riskLevel: resolveRiskLevel(combinedRiskScore),
    aggregateRiskScore,
    highestRiskScore,
    executionPressureScore,
    identifiedRisks,
    recommendedMitigations,
  };
}
