import { StrategicObjective } from "./strategicObjective";

export interface StrategicRoadmapItem {
  id: string;
  objectiveId: string;
  title: string;
  phase: "now" | "next" | "later";
  priorityScore: number;
}

export function createStrategicRoadmap(
  objectives: StrategicObjective[],
): StrategicRoadmapItem[] {
  return objectives.map((objective, index) => ({
    id: `roadmap-${objective.id}`,
    objectiveId: objective.id,
    title: objective.title,
    phase: index < 2 ? "now" : index < 5 ? "next" : "later",
    priorityScore: objective.priorityScore,
  }));
}