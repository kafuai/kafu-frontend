import {
  PortfolioHealthScore,
  PortfolioInitiative,
  PortfolioProfile,
  PortfolioRiskLevel,
} from "./portfolio-management.types";

export class PortfolioHealthScorer {
  score(profile: PortfolioProfile): PortfolioHealthScore {
    const initiatives = profile.initiatives;

    if (initiatives.length === 0) {
      return {
        portfolioId: profile.portfolioId,
        overallScore: 0,
        valueScore: 0,
        riskScore: 0,
        executionScore: 0,
        alignmentScore: 0,
        riskLevel: "severe",
      };
    }

    const valueScore = this.calculateValueScore(initiatives);
    const riskScore = this.calculateRiskScore(initiatives);
    const executionScore = this.calculateExecutionScore(initiatives);
    const alignmentScore = this.calculateAlignmentScore(initiatives);

    const overallScore = Math.round(
      valueScore * 0.3 +
        riskScore * 0.25 +
        executionScore * 0.25 +
        alignmentScore * 0.2,
    );

    return {
      portfolioId: profile.portfolioId,
      overallScore,
      valueScore,
      riskScore,
      executionScore,
      alignmentScore,
      riskLevel: this.resolveRiskLevel(overallScore, riskScore),
    };
  }

  private calculateValueScore(initiatives: PortfolioInitiative[]): number {
    const totalValue = initiatives.reduce(
      (sum, initiative) => sum + initiative.expectedValue,
      0,
    );

    const totalCost = initiatives.reduce(
      (sum, initiative) => sum + initiative.executionCost,
      0,
    );

    if (totalCost <= 0) return 100;

    return Math.min(100, Math.round((totalValue / totalCost) * 50));
  }

  private calculateRiskScore(initiatives: PortfolioInitiative[]): number {
    const averageRisk =
      initiatives.reduce((sum, initiative) => sum + initiative.riskScore, 0) /
      initiatives.length;

    return Math.max(0, Math.round(100 - averageRisk));
  }

  private calculateExecutionScore(initiatives: PortfolioInitiative[]): number {
    const statusWeights: Record<PortfolioInitiative["status"], number> = {
      planned: 70,
      active: 85,
      at_risk: 45,
      blocked: 20,
      completed: 100,
    };

    const average =
      initiatives.reduce(
        (sum, initiative) => sum + statusWeights[initiative.status],
        0,
      ) / initiatives.length;

    return Math.round(average);
  }

  private calculateAlignmentScore(initiatives: PortfolioInitiative[]): number {
    const alignedInitiatives = initiatives.filter(
      (initiative) => initiative.strategicObjective.trim().length > 0,
    );

    return Math.round((alignedInitiatives.length / initiatives.length) * 100);
  }

  private resolveRiskLevel(
    overallScore: number,
    riskScore: number,
  ): PortfolioRiskLevel {
    if (overallScore < 40 || riskScore < 35) return "severe";
    if (overallScore < 60 || riskScore < 55) return "high";
    if (overallScore < 80 || riskScore < 75) return "moderate";
    return "low";
  }
}