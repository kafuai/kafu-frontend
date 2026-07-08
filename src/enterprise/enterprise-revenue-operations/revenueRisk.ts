import type {
  RevenueRiskLevel,
} from "./revenueOperationsTypes";

export interface RevenueRiskAssessment {
  id: string;
  accountId: string;
  level: RevenueRiskLevel;
  reason: string;
  mitigation: string;
}

export function isCriticalRevenueRisk(
  risk: RevenueRiskAssessment,
): boolean {
  return risk.level === "critical";
}
