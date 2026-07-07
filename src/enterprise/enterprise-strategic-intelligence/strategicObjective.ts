import { StrategicOption } from "./strategicOption";

export interface StrategicObjective {
  id: string;
  title: string;
  description: string;
  linkedOptionId: string;
  priorityScore: number;
}

export function createStrategicObjectives(
  options: StrategicOption[],
): StrategicObjective[] {
  return options.map((option) => ({
    id: `objective-${option.id}`,
    title: option.title.replace("Strategic Option:", "Objective:"),
    description: option.rationale,
    linkedOptionId: option.id,
    priorityScore: option.score,
  }));
}