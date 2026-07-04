import { EnterpriseInitiative } from "./initiativeTypes";
import { evaluateInitiativeReadiness } from "./initiativeReadinessEvaluator";
import { scoreInitiativePriority } from "./initiativePriorityScorer";
import { analyzeInitiativePortfolioAlignment } from "./initiativePortfolioAlignmentAnalyzer";

export interface InitiativeExecutionSnapshot {
  initiativeId: string;
  readinessScore: number;
  priorityScore: number;
  portfolioAlignmentScore: number;
  overallExecutionScore: number;
  status: "excellent" | "good" | "attention" | "critical";
}

export function createInitiativeExecutionSnapshot(
  initiative: EnterpriseInitiative,
): InitiativeExecutionSnapshot {
  const readiness = evaluateInitiativeReadiness(initiative);
  const priority = scoreInitiativePriority(initiative);
  const alignment = analyzeInitiativePortfolioAlignment(initiative);

  const overallExecutionScore = Math.round(
    readiness.readinessScore * 0.4 +
      priority.score * 0.3 +
      alignment.alignmentScore * 0.3,
  );

  let status: InitiativeExecutionSnapshot["status"] = "critical";

  if (overallExecutionScore >= 90) {
    status = "excellent";
  } else if (overallExecutionScore >= 75) {
    status = "good";
  } else if (overallExecutionScore >= 60) {
    status = "attention";
  }

  return {
    initiativeId: initiative.initiativeId,
    readinessScore: readiness.readinessScore,
    priorityScore: priority.score,
    portfolioAlignmentScore: alignment.alignmentScore,
    overallExecutionScore,
    status,
  };
}