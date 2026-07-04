import { AIPlanningOption } from "./aiPlanningOption";

export interface AIPlanningScore {
  optionId: string;
  valueScore: number;
  costScore: number;
  durationScore: number;
  confidenceScore: number;
  totalScore: number;
}

const CONFIDENCE_WEIGHT: Record<AIPlanningOption["confidence"], number> = {
  low: 0.4,
  medium: 0.7,
  high: 1,
};

export function scoreAIPlanningOption(
  option: AIPlanningOption,
): AIPlanningScore {
  const valueScore = option.expectedValue;

  const costScore =
    option.estimatedCost <= 0
      ? valueScore
      : valueScore / option.estimatedCost;

  const durationScore =
    option.estimatedDurationDays <= 0
      ? 1
      : 365 / option.estimatedDurationDays;

  const confidenceScore = CONFIDENCE_WEIGHT[option.confidence];

  const totalScore =
    valueScore * 0.45 +
    costScore * 0.20 +
    durationScore * 0.15 +
    confidenceScore * 100 * 0.20;

  return {
    optionId: option.id,
    valueScore,
    costScore,
    durationScore,
    confidenceScore,
    totalScore,
  };
}