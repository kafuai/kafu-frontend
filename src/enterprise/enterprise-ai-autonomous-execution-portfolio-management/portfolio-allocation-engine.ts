import {
  PortfolioAllocationRecommendation,
  PortfolioInitiative,
} from "./portfolio-management.types";

export class PortfolioAllocationEngine {
  recommend(
    initiatives: PortfolioInitiative[],
  ): PortfolioAllocationRecommendation[] {
    const scored = initiatives.map((initiative) => {
      const score =
        initiative.expectedValue * 0.45 +
        initiative.confidenceScore * 0.25 -
        initiative.executionCost * 0.10 -
        initiative.riskScore * 0.20;

      return {
        initiative,
        score: Math.max(score, 1),
      };
    });

    const totalScore = scored.reduce((sum, item) => sum + item.score, 0);

    return scored
      .sort((a, b) => b.score - a.score)
      .map((item) => ({
        initiativeId: item.initiative.id,
        recommendedAllocationWeight: Number(
          ((item.score / totalScore) * 100).toFixed(2),
        ),
        rationale:
          item.score >= totalScore / scored.length
            ? "High strategic return with balanced execution profile."
            : "Maintain controlled investment while monitoring performance.",
      }));
  }
}