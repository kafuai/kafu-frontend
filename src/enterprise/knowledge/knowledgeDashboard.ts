import { KnowledgeReport } from "./knowledgeReporting";

export interface KnowledgeDashboardCard {
  id: string;
  title: string;
  value: string | number;
  severity: "info" | "success" | "warning" | "critical";
}

export interface KnowledgeDashboard {
  tenantId: string;
  cards: KnowledgeDashboardCard[];
  generatedAt: string;
}

export function buildKnowledgeDashboard(
  report: KnowledgeReport,
): KnowledgeDashboard {
  return {
    tenantId: report.tenantId,
    generatedAt: new Date().toISOString(),
    cards: [
      {
        id: "total-assets",
        title: "Total Knowledge Assets",
        value: report.summary.totalAssets,
        severity: "info",
      },
      {
        id: "active-assets",
        title: "Active Knowledge Assets",
        value: report.summary.activeAssets,
        severity: report.summary.activeAssets > 0 ? "success" : "critical",
      },
      {
        id: "average-quality",
        title: "Average Quality Score",
        value: report.summary.averageQualityScore,
        severity:
          report.summary.averageQualityScore >= 75
            ? "success"
            : report.summary.averageQualityScore >= 60
              ? "warning"
              : "critical",
      },
      {
        id: "high-severity-gaps",
        title: "High Severity Knowledge Gaps",
        value: report.highSeverityGaps.length,
        severity: report.highSeverityGaps.length > 0 ? "critical" : "success",
      },
      {
        id: "recommendations",
        title: "Knowledge Recommendations",
        value: report.recommendations.length,
        severity: report.recommendations.length > 0 ? "warning" : "success",
      },
    ],
  };
}