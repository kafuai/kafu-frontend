import type { FPAStatus } from "./fpaTypes";

export interface FPAKpi {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  owner: string;
  status: FPAStatus;
}

export function calculateKpiAchievement(kpi: FPAKpi): number {
  if (kpi.target === 0) return 0;
  return Number(((kpi.actual / kpi.target) * 100).toFixed(2));
}
