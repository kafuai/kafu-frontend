export type CustomerRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface CustomerRisk {
  accountId: string;
  level: CustomerRiskLevel;
  reasons: string[];
}

export function hasHighRisk(
  risk: CustomerRisk,
): boolean {
  return risk.level === "high" || risk.level === "critical";
}