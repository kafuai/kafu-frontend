import type { FPAAmount, FPAMetricDirection } from "./fpaTypes";

export interface FPAVariance {
  id: string;
  metric: string;
  planned: FPAAmount;
  actual: FPAAmount;
  threshold: number;
  owner: string;
  explanation?: string;
}

export function calculateVarianceAmount(variance: FPAVariance): number {
  return Number((variance.actual.value - variance.planned.value).toFixed(2));
}

export function calculateVarianceRate(variance: FPAVariance): number {
  if (variance.planned.value === 0) return 0;
  return Number((((variance.actual.value - variance.planned.value) / variance.planned.value) * 100).toFixed(2));
}

export function getVarianceDirection(variance: FPAVariance): FPAMetricDirection {
  const amount = calculateVarianceAmount(variance);
  if (amount > 0) return "increase";
  if (amount < 0) return "decrease";
  return "stable";
}
