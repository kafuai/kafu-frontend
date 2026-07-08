import { classifyCustomerHealth } from "./customerHealthScore";
import { calculateCustomerSuccessScore } from "./customerSuccessMetrics";
import type { CustomerHealth } from "./customerSuccessTypes";
import type { CustomerSuccessMetrics } from "./customerSuccessMetrics";

export interface CustomerSuccessEngineResult {
  accountId: string;
  score: number;
  health: CustomerHealth;
  generatedAt: Date;
}

export function runCustomerSuccessEngine(
  metrics: CustomerSuccessMetrics,
): CustomerSuccessEngineResult {
  const score = calculateCustomerSuccessScore(metrics);

  return {
    accountId: metrics.accountId,
    score,
    health: classifyCustomerHealth(score),
    generatedAt: new Date(),
  };
}