import type { SupplierScorecard } from "./supplierRelationshipTypes";

export interface SupplierRelationshipDashboard {
  suppliersCount: number;
  averageScore: number;
  riskSuppliers: number;
  generatedAt: string;
}

export function buildSupplierDashboard(
  scorecards: SupplierScorecard[]
): SupplierRelationshipDashboard {
  const total = scorecards.reduce(
    (sum, item) => sum + item.overallScore,
    0
  );

  return {
    suppliersCount: scorecards.length,
    averageScore: scorecards.length
      ? Math.round(total / scorecards.length)
      : 0,
    riskSuppliers: scorecards.filter(
      (item) => item.riskScore >= 50
    ).length,
    generatedAt: new Date().toISOString(),
  };
}
