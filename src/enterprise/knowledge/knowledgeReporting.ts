import { KnowledgeAsset, KnowledgeSource } from "./knowledgeTypes";
import {
  KnowledgeInsightSummary,
  generateKnowledgeInsightSummary,
  hasKnowledgeCoverageRisk,
} from "./knowledgeInsights";
import {
  KnowledgeGap,
  analyzeKnowledgeGaps,
  getHighSeverityKnowledgeGaps,
} from "./knowledgeGapAnalysis";
import { KnowledgeRecommendation } from "./knowledgeRecommendation";

export interface KnowledgeReport {
  tenantId: string;
  summary: KnowledgeInsightSummary;
  gaps: KnowledgeGap[];
  highSeverityGaps: KnowledgeGap[];
  recommendations: KnowledgeRecommendation[];
  generatedAt: string;
}

export function generateKnowledgeReport(input: {
  tenantId: string;
  sources: KnowledgeSource[];
  assets: KnowledgeAsset[];
  taxonomyNodes: Parameters<typeof analyzeKnowledgeGaps>[0]["taxonomyNodes"];
  recommendations: KnowledgeRecommendation[];
}): KnowledgeReport {
  const summary = generateKnowledgeInsightSummary({
    tenantId: input.tenantId,
    sources: input.sources,
    assets: input.assets,
  });

  const gaps = analyzeKnowledgeGaps({
    taxonomyNodes: input.taxonomyNodes,
    assets: input.assets.filter(
      (asset) => asset.metadata.tenantId === input.tenantId,
    ),
  });

  return {
    tenantId: input.tenantId,
    summary,
    gaps,
    highSeverityGaps: getHighSeverityKnowledgeGaps(gaps),
    recommendations: input.recommendations,
    generatedAt: new Date().toISOString(),
  };
}

export function summarizeKnowledgeReport(report: KnowledgeReport): string {
  const riskStatus = hasKnowledgeCoverageRisk(report.summary)
    ? "Coverage risk detected"
    : "Coverage is acceptable";

  return [
    `Knowledge Report for tenant ${report.tenantId}`,
    `Total sources: ${report.summary.totalSources}`,
    `Enabled sources: ${report.summary.enabledSources}`,
    `Total assets: ${report.summary.totalAssets}`,
    `Active assets: ${report.summary.activeAssets}`,
    `Average quality score: ${report.summary.averageQualityScore}`,
    `High severity gaps: ${report.highSeverityGaps.length}`,
    `Recommendations: ${report.recommendations.length}`,
    `Status: ${riskStatus}`,
  ].join("\n");
}