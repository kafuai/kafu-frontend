import type { SupplierRelationshipReport } from "./supplierRelationshipTypes";

export function createSupplierRelationshipReport(
  report: SupplierRelationshipReport
): SupplierRelationshipReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function hasSupplierRecommendations(
  report: SupplierRelationshipReport
): boolean {
  return report.recommendations.length > 0;
}
