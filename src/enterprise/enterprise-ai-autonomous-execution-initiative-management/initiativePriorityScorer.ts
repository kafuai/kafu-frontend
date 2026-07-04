import {
  EnterpriseInitiative,
  InitiativeImpactLevel,
  InitiativePriorityLevel,
  InitiativeRiskLevel,
} from "./initiativeTypes";

export interface InitiativePriorityScore {
  initiativeId: string;
  score: number;
  recommendedPriority: InitiativePriorityLevel;
  rationale: string[];
}

const impactScore: Record<InitiativeImpactLevel, number> = {
  limited: 10,
  moderate: 25,
  significant: 40,
  transformational: 55,
};

const riskAdjustment: Record<InitiativeRiskLevel, number> = {
  low: 0,
  medium: -5,
  high: -12,
  critical: -20,
};

export function scoreInitiativePriority(
  initiative: EnterpriseInitiative,
): InitiativePriorityScore {
  const rationale: string[] = [];

  let score = impactScore[initiative.impact];

  rationale.push(`Impact level contributes ${impactScore[initiative.impact]} points.`);

  if (initiative.programId) {
    score += 10;
    rationale.push("Linked program increases execution priority.");
  }

  if (initiative.portfolioId) {
    score += 10;
    rationale.push("Linked portfolio increases strategic priority.");
  }

  const metricCountBonus = Math.min(15, initiative.metrics.length * 5);
  score += metricCountBonus;

  if (metricCountBonus > 0) {
    rationale.push(`Defined metrics add ${metricCountBonus} points.`);
  }

  const dependencyPenalty = initiative.dependencies.filter(
    (dependency) => dependency.isBlocking,
  ).length * 8;

  score -= dependencyPenalty;

  if (dependencyPenalty > 0) {
    rationale.push(`Blocking dependencies reduce priority by ${dependencyPenalty} points.`);
  }

  for (const risk of initiative.risks) {
    score += riskAdjustment[risk.level];

    if (riskAdjustment[risk.level] !== 0) {
      rationale.push(
        `${risk.level} risk adjusts priority by ${riskAdjustment[risk.level]} points.`,
      );
    }
  }

  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let recommendedPriority: InitiativePriorityLevel = "low";

  if (normalizedScore >= 80) {
    recommendedPriority = "critical";
  } else if (normalizedScore >= 60) {
    recommendedPriority = "high";
  } else if (normalizedScore >= 35) {
    recommendedPriority = "medium";
  }

  return {
    initiativeId: initiative.initiativeId,
    score: normalizedScore,
    recommendedPriority,
    rationale,
  };
}