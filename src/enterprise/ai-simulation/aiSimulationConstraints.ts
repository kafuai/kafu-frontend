export interface AISimulationConstraint {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  isHardConstraint: boolean;
  limitValue?: number;
  unit?: string;
}

export function hasBlockingAISimulationConstraints(
  constraints: AISimulationConstraint[],
): boolean {
  return constraints.some((constraint) => constraint.isHardConstraint);
}
