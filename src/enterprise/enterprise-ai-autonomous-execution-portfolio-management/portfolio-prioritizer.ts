import { PortfolioInitiative } from "./portfolio-management.types";

export class PortfolioPrioritizer {
  prioritize(
    initiatives: PortfolioInitiative[],
  ): PortfolioInitiative[] {
    const priorityWeight: Record<PortfolioInitiative["priority"], number> = {
      critical: 100,
      high: 80,
      medium: 60,
      low: 40,
    };

    return [...initiatives].sort((a, b) => {
      const scoreA =
        priorityWeight[a.priority] +
        a.expectedValue * 0.35 +
        a.confidenceScore * 0.20 -
        a.executionCost * 0.05 -
        a.riskScore * 0.40;

      const scoreB =
        priorityWeight[b.priority] +
        b.expectedValue * 0.35 +
        b.confidenceScore * 0.20 -
        b.executionCost * 0.05 -
        b.riskScore * 0.40;

      return scoreB - scoreA;
    });
  }
}