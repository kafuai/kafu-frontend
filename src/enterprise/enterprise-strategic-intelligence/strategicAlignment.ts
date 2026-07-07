import { StrategicObjective } from "./strategicObjective";

export interface StrategicAlignmentResult {
  objectiveId: string;
  aligned: boolean;
  score: number;
  note: string;
}

export function evaluateStrategicAlignment(
  objectives: StrategicObjective[],
): StrategicAlignmentResult[] {
  return objectives.map((objective) => ({
    objectiveId: objective.id,
    aligned: objective.priorityScore >= 50,
    score: objective.priorityScore,
    note:
      objective.priorityScore >= 50
        ? "Objective is aligned with current strategic priorities."
        : "Objective requires further validation before prioritization.",
  }));
}