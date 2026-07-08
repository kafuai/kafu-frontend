export interface RevenueKPI {
  key: string;
  label: string;
  value: number;
  target: number;
}

export function kpiAchievement(kpi: RevenueKPI): number {
  if (kpi.target <= 0) {
    return 0;
  }

  return kpi.value / kpi.target;
}
