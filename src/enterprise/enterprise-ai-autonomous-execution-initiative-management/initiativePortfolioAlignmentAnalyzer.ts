import { EnterpriseInitiative } from "./initiativeTypes";

export interface InitiativePortfolioAlignmentResult {
  initiativeId: string;
  alignmentScore: number;
  aligned: boolean;
  observations: string[];
}

export function analyzeInitiativePortfolioAlignment(
  initiative: EnterpriseInitiative,
): InitiativePortfolioAlignmentResult {
  const observations: string[] = [];
  let score = 0;

  if (initiative.portfolioId) {
    score += 35;
    observations.push("Initiative is linked to a portfolio.");
  } else {
    observations.push("Portfolio association is missing.");
  }

  if (initiative.programId) {
    score += 25;
    observations.push("Initiative is linked to a program.");
  } else {
    observations.push("Program association is missing.");
  }

  if (initiative.strategicObjectiveId) {
    score += 20;
    observations.push("Strategic objective linkage is established.");
  }

  const metricWeight = initiative.metrics.reduce(
    (sum, metric) => sum + metric.weight,
    0,
  );

  if (metricWeight >= 100) {
    score += 20;
    observations.push("Success metrics are fully weighted.");
  } else {
    observations.push("Success metric weighting is incomplete.");
  }

  const alignmentScore = Math.min(100, Math.round(score));

  return {
    initiativeId: initiative.initiativeId,
    alignmentScore,
    aligned: alignmentScore >= 70,
    observations,
  };
}