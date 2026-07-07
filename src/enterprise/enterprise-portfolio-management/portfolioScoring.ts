import { PortfolioDecisionContext } from "./portfolioManagementTypes";

export function normalizePortfolioScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}

export function calculatePortfolioScore(
  context: PortfolioDecisionContext,
): number {
  const strategy = normalizePortfolioScore(context.strategyAlignmentScore);
  const value = normalizePortfolioScore(context.businessValueScore);
  const readiness = normalizePortfolioScore(context.readinessScore);
  const risk = normalizePortfolioScore(1 - context.riskScore);
  const investment = normalizePortfolioScore(context.investmentScore);

  return Math.round(
    (strategy * 0.3 +
      value * 0.25 +
      readiness * 0.2 +
      risk * 0.15 +
      investment * 0.1) *
      100,
  );
}