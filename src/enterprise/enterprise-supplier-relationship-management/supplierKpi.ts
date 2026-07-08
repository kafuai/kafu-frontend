export interface SupplierKpiDefinition {
  name: string;
  target: number;
  measurementUnit: string;
}

export function validateSupplierKpi(
  kpi: SupplierKpiDefinition
): boolean {
  return (
    kpi.name.length > 0 &&
    kpi.target >= 0 &&
    kpi.measurementUnit.length > 0
  );
}

export function normalizeSupplierKpiName(
  name: string
): string {
  return name.trim().toLowerCase();
}
