import { EnterpriseRiskMetrics } from "./riskMetrics";

export interface EnterpriseRiskDashboard {
  generatedAt: string;
  metrics: EnterpriseRiskMetrics;
  executiveSummary: string;
}

export function createEnterpriseRiskDashboard(
  metrics: EnterpriseRiskMetrics,
): EnterpriseRiskDashboard {
  return {
    generatedAt: new Date().toISOString(),
    metrics,
    executiveSummary:
      `Risk portfolio contains ${metrics.totalRisks} risks, including ${metrics.criticalRisks} critical and ${metrics.highRisks} high risks.`,
  };
}