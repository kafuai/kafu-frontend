export interface AIOrchestrationExecutionTarget {
  readonly id: string;
  readonly capacity: number;
  readonly currentLoad: number;
}

export function selectExecutionTarget(
  targets: AIOrchestrationExecutionTarget[],
): AIOrchestrationExecutionTarget | undefined {
  return [...targets]
    .sort((a, b) => {
      const loadA = a.currentLoad / Math.max(a.capacity, 1);
      const loadB = b.currentLoad / Math.max(b.capacity, 1);

      return loadA - loadB;
    })
    .at(0);
}