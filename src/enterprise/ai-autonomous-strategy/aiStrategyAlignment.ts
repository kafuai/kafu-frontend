import { AIStrategyObjective } from "./aiStrategyObjective";
import { AIStrategyInitiative } from "./aiStrategyPlanner";

export interface AIStrategyAlignmentResult {
  initiativeId: string;
  alignedObjectiveIds: string[];
  missingObjectiveIds: string[];
  alignmentScore: number;
  summary: string;
}

export function evaluateAIStrategyAlignment(
  initiative: AIStrategyInitiative,
  objectives: AIStrategyObjective[],
): AIStrategyAlignmentResult {
  const alignedObjectiveIds = objectives
    .filter((objective) =>
      initiative.successMetrics.some((metric) =>
        objective.measurableIndicators.some((indicator) =>
          metric.toLowerCase().includes(indicator.toLowerCase()),
        ),
      ),
    )
    .map((objective) => objective.id);

  const missingObjectiveIds = objectives
    .filter((objective) => !alignedObjectiveIds.includes(objective.id))
    .map((objective) => objective.id);

  const alignmentScore =
    objectives.length === 0 ? 0 : alignedObjectiveIds.length / objectives.length;

  return {
    initiativeId: initiative.id,
    alignedObjectiveIds,
    missingObjectiveIds,
    alignmentScore,
    summary:
      alignmentScore >= 0.7
        ? "Initiative is strongly aligned with strategy objectives."
        : "Initiative needs stronger alignment with strategy objectives.",
  };
}