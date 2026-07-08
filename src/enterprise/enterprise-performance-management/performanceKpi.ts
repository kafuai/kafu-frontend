export interface PerformanceKpi {
  name: string;
  target: number;
  actual: number;
}

export function calculateKpiScore(
  kpi: PerformanceKpi
): number {
  if (!kpi.target) return 0;

  return Math.round(
    (kpi.actual / kpi.target) * 100
  );
}

export function isKpiAchieved(
  kpi: PerformanceKpi
): boolean {
  return kpi.actual >= kpi.target;
}
