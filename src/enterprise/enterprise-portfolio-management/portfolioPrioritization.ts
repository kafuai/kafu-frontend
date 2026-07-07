import { PortfolioInitiative } from "./portfolioInitiative";
import { PortfolioDecisionContext } from "./portfolioManagementTypes";
import { calculatePortfolioScore } from "./portfolioScoring";

export interface PrioritizedPortfolioInitiative {
  initiative: PortfolioInitiative;
  score: number;
  rank: number;
}

export function prioritizePortfolioInitiatives(
  initiatives: PortfolioInitiative[],
  contexts: Record<string, PortfolioDecisionContext>,
): PrioritizedPortfolioInitiative[] {
  return initiatives
    .map((initiative) => ({
      initiative,
      score: calculatePortfolioScore(
        contexts[initiative.id] ?? {
          strategyAlignmentScore: 0,
          businessValueScore: 0,
          readinessScore: 0,
          riskScore: 1,
          investmentScore: 0,
        },
      ),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}