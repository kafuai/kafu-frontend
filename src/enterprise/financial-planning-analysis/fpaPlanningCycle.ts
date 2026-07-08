import type { FPAStatus } from "./fpaTypes";

export interface FPAPlanningMilestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
}

export interface FPAPlanningCycle {
  id: string;
  fiscalYear: number;
  status: FPAStatus;
  milestones: FPAPlanningMilestone[];
}

export function planningProgress(cycle: FPAPlanningCycle): number {
  if (cycle.milestones.length === 0) return 0;
  const completed = cycle.milestones.filter((m) => m.completed).length;
  return Number(((completed / cycle.milestones.length) * 100).toFixed(2));
}
