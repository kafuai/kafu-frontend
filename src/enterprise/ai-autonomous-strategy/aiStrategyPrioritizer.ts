import { AIAutonomousStrategyPriority } from "./aiAutonomousStrategyTypes";
import { AIStrategyInitiative } from "./aiStrategyPlanner";

export interface AIStrategyPrioritizedInitiative {
  initiative: AIStrategyInitiative;
  score: number;
  rank: number;
  reason: string;
}

const priorityWeight: Record<AIAutonomousStrategyPriority, number> = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  critical: 1,
};

export function scoreAIStrategyInitiative(initiative: AIStrategyInitiative): number {
  const priorityScore = priorityWeight[initiative.priority];
  const metricScore = Math.min(1, initiative.successMetrics.length / 5);

  return Number((priorityScore * 0.75 + metricScore * 0.25).toFixed(4));
}

export function prioritizeAIStrategyInitiatives(
  initiatives: AIStrategyInitiative[],
): AIStrategyPrioritizedInitiative[] {
  return initiatives
    .map((initiative) => ({
      initiative,
      score: scoreAIStrategyInitiative(initiative),
      rank: 0,
      reason: `Priority ${initiative.priority} with ${initiative.successMetrics.length} success metrics.`,
    }))
    .sort((left, right) => right.score - left.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}