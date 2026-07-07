import { PortfolioRiskLevel } from "./portfolioManagementTypes";

export interface PortfolioRisk {
  id: string;
  initiativeId: string;
  title: string;
  description: string;
  level: PortfolioRiskLevel;
  probability: number;
  impact: number;
  mitigationPlan?: string;
}

export function calculatePortfolioRiskScore(risk: PortfolioRisk): number {
  return Math.round(
    Math.max(0, Math.min(risk.probability, 1)) *
      Math.max(0, Math.min(risk.impact, 1)) *
      100,
  );
}

export function getHighestPortfolioRisk(
  risks: PortfolioRisk[],
): PortfolioRisk | undefined {
  return [...risks].sort(
    (a, b) => calculatePortfolioRiskScore(b) - calculatePortfolioRiskScore(a),
  )[0];
}