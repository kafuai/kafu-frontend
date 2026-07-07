import { EnterpriseStrategicIntelligenceReport } from "./strategicReport";

export interface StrategicDashboardSummary {
  organizationId: string;
  insightCount: number;
  recommendationCount: number;
  roadmapItemCount: number;
  riskCount: number;
  generatedAt: Date;
}

export function createStrategicDashboardSummary(
  report: EnterpriseStrategicIntelligenceReport,
): StrategicDashboardSummary {
  return {
    organizationId: report.organizationId,
    insightCount: report.insights.length,
    recommendationCount: report.recommendations.length,
    roadmapItemCount: report.roadmap.length,
    riskCount: report.risks.length,
    generatedAt: report.generatedAt,
  };
}