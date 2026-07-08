import type { CustomerHealth } from "./customerSuccessTypes";

export interface CustomerHealthScore {
  accountId: string;
  score: number;
  health: CustomerHealth;
  calculatedAt: Date;
}

export function classifyCustomerHealth(score: number): CustomerHealth {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  if (score >= 40) return "poor";
  return "critical";
}