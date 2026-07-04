import type { DecisionOption } from "./decisionOption";

export class DecisionScoreCalculator {
  public calculate(option: DecisionOption): number {
    const valueWeight = 0.45;
    const confidenceWeight = 0.30;
    const effortWeight = 0.15;
    const riskWeight = 0.10;

    const effortScore = Math.max(0, 100 - option.estimatedEffort);

    const riskScoreMap: Record<string, number> = {
      low: 100,
      medium: 75,
      high: 40,
      severe: 10,
    };

    const riskScore = riskScoreMap[option.riskLevel] ?? 0;

    return (
      option.businessValue * valueWeight +
      option.confidenceScore * confidenceWeight +
      effortScore * effortWeight +
      riskScore * riskWeight
    );
  }
}