import type { CustomerRiskLevel } from "./customerRisk";

export interface CustomerChurnPrediction {
  accountId: string;
  probability: number;
  risk: CustomerRiskLevel;
}

export function predictChurnRisk(
  probability: number,
): CustomerRiskLevel {
  if (probability >= 0.8) return "critical";
  if (probability >= 0.6) return "high";
  if (probability >= 0.3) return "medium";
  return "low";
}