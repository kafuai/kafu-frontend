import { EnterpriseRisk } from "./riskTypes";
import { calculateRiskScore, RiskScoreResult } from "./riskScore";

export type PrioritizedRisk = {
  risk: EnterpriseRisk;
  score: RiskScoreResult;
  priority: number;
};

export function prioritizeRisks(
  risks: EnterpriseRisk[],
): PrioritizedRisk[] {
  return risks
    .map((risk) => ({
      risk,
      score: calculateRiskScore(risk),
      priority: calculateRiskScore(risk).totalScore,
    }))
    .sort((a, b) => b.priority - a.priority);
}

export function getTopRisks(
  risks: EnterpriseRisk[],
  limit: number,
): PrioritizedRisk[] {
  return prioritizeRisks(risks).slice(0, Math.max(0, limit));
}