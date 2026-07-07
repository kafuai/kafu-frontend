import { OptimizationAnalytics } from "./optimizationAnalytics";
import { OptimizationGovernanceResult } from "./optimizationGovernance";

export interface OptimizationReport {
  summary: string;
  analytics: OptimizationAnalytics;
  governance: OptimizationGovernanceResult;
  generatedAt: Date;
}

export function generateOptimizationReport(
  analytics: OptimizationAnalytics,
  governance: OptimizationGovernanceResult,
): OptimizationReport {
  return {
    summary:
      `Optimization Analysis: ${analytics.totalOpportunities} opportunities, ` +
      `${analytics.highPriorityCount} high-priority.`,
    analytics,
    governance,
    generatedAt: new Date(),
  };
}