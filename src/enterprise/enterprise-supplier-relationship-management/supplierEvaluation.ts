import type { SupplierRelationshipHealth, SupplierScorecard } from "./supplierRelationshipTypes";

export function evaluateSupplierHealth(
  scorecard: SupplierScorecard
): SupplierRelationshipHealth {
  if (scorecard.overallScore >= 90) return "excellent";
  if (scorecard.overallScore >= 75) return "healthy";
  if (scorecard.overallScore >= 60) return "watch";
  if (scorecard.overallScore >= 40) return "at_risk";

  return "critical";
}
