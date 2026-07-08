import type { SupplierKpi } from "./supplierRelationshipTypes";

export function calculateSupplierPerformanceScore(
  kpis: SupplierKpi[]
): number {
  if (!kpis.length) return 0;

  const total = kpis.reduce((sum, item) => {
    if (!item.target) return sum;
    return sum + Math.min((item.actual / item.target) * 100, 100);
  }, 0);

  return Math.round(total / kpis.length);
}

export function findSupplierPerformanceIssues(
  kpis: SupplierKpi[]
): SupplierKpi[] {
  return kpis.filter(
    (item) => item.target > 0 && item.actual < item.target
  );
}
