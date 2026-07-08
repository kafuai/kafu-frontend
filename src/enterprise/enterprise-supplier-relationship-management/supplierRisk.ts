import type { SupplierRiskLevel } from "./supplierRelationshipTypes";

export interface SupplierRiskAssessment {
  supplierId: string;
  riskLevel: SupplierRiskLevel;
  factors: string[];
  assessedAt: string;
}

export function calculateSupplierRisk(
  factorsCount: number
): SupplierRiskLevel {
  if (factorsCount >= 5) return "critical";
  if (factorsCount >= 3) return "high";
  if (factorsCount >= 1) return "medium";

  return "low";
}
