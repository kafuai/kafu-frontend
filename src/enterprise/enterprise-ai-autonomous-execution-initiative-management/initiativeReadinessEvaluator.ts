import {
  EnterpriseInitiative,
  InitiativeLifecycleState,
  InitiativeRiskLevel,
} from "./initiativeTypes";

export interface InitiativeReadinessResult {
  initiativeId: string;
  readinessScore: number;
  readinessState: InitiativeLifecycleState;
  blockers: string[];
  warnings: string[];
}

const riskPenalty: Record<InitiativeRiskLevel, number> = {
  low: 2,
  medium: 7,
  high: 15,
  critical: 25,
};

export function evaluateInitiativeReadiness(
  initiative: EnterpriseInitiative,
): InitiativeReadinessResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  let score = 100;

  if (!initiative.owner?.ownerId) {
    blockers.push("Initiative owner is missing.");
    score -= 25;
  }

  if (!initiative.strategicObjectiveId) {
    blockers.push("Strategic objective link is missing.");
    score -= 20;
  }

  const blockingDependencies = initiative.dependencies.filter(
    (dependency) => dependency.isBlocking,
  );

  if (blockingDependencies.length > 0) {
    blockers.push(
      `${blockingDependencies.length} blocking dependencies must be resolved.`,
    );
    score -= blockingDependencies.length * 10;
  }

  if (initiative.metrics.length === 0) {
    warnings.push("No measurable success metrics defined.");
    score -= 15;
  }

  const totalMetricWeight = initiative.metrics.reduce(
    (sum, metric) => sum + metric.weight,
    0,
  );

  if (initiative.metrics.length > 0 && totalMetricWeight <= 0) {
    warnings.push("Metric weights are not configured.");
    score -= 10;
  }

  for (const risk of initiative.risks) {
    score -= riskPenalty[risk.level];

    if (risk.level === "critical") {
      blockers.push(`Critical risk requires mitigation: ${risk.description}`);
    }

    if (!risk.mitigation) {
      warnings.push(`Risk has no mitigation plan: ${risk.description}`);
      score -= 5;
    }
  }

  const readinessScore = Math.max(0, Math.min(100, Math.round(score)));

  let readinessState: InitiativeLifecycleState = "ready";

  if (blockers.length > 0) {
    readinessState = "blocked";
  } else if (readinessScore < 60) {
    readinessState = "at_risk";
  } else if (readinessScore < 80) {
    readinessState = "approved";
  }

  return {
    initiativeId: initiative.initiativeId,
    readinessScore,
    readinessState,
    blockers,
    warnings,
  };
}