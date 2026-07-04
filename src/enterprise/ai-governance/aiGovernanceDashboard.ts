import { AIGovernanceReport } from "./aiGovernanceReport";

export interface AIGovernanceDashboard {
  organizationId: string;
  generatedAt: Date;
  governanceScore: number;
  activePolicies: number;
  governedModels: number;
  criticalEvents: number;
  recommendations: string[];
}

export function buildAIGovernanceDashboard(
  report: AIGovernanceReport,
): AIGovernanceDashboard {
  return {
    organizationId: report.organizationId,
    generatedAt: new Date(),
    governanceScore: report.summary.averageGovernanceScore,
    activePolicies: report.summary.activePolicies,
    governedModels: report.summary.governedModels,
    criticalEvents: report.summary.criticalEvents,
    recommendations: report.recommendations,
  };
}