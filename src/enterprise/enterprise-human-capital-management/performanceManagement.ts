export interface PerformanceCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export function activatePerformanceCycle(
  cycle: PerformanceCycle
): PerformanceCycle {
  return {
    ...cycle,
    active: true,
  };
}

export function isPerformanceCycleActive(
  cycle: PerformanceCycle
): boolean {
  return cycle.active;
}
