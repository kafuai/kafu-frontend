import type { SupplierScorecard } from "./supplierRelationshipTypes";

export function createSupplierScorecard(
  supplierId: string,
  performanceScore: number,
  complianceScore: number,
  riskScore: number,
  collaborationScore: number
): SupplierScorecard {
  return {
    supplierId,
    performanceScore,
    complianceScore,
    riskScore,
    collaborationScore,
    overallScore: Math.round(
      performanceScore * 0.35 +
      complianceScore * 0.25 +
      collaborationScore * 0.25 +
      (100 - riskScore) * 0.15
    ),
    generatedAt: new Date().toISOString(),
  };
}
