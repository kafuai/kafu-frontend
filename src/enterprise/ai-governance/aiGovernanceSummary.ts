import { AIGovernanceReport } from "./aiGovernanceReport";

export interface AIGovernanceSummary {
  organizationId: string;
  governanceScore: number;
  totalPolicies: number;
  activePolicies: number;
  governedModels: number;
  criticalEvents: number;
}

export function summarizeAIGovernance(
  report: AIGovernanceReport,
): AIGovernanceSummary {
  return {
    organizationId: report.organizationId,
    governanceScore: report.summary.averageGovernanceScore,
    totalPolicies: report.summary.totalPolicies,
    activePolicies: report.summary.activePolicies,
    governedModels: report.summary.governedModels,
    criticalEvents: report.summary.criticalEvents,
  };
}