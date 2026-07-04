import { KnowledgeAsset, KnowledgeSource } from "./knowledgeTypes";
import { evaluateKnowledgeQuality } from "./knowledgeQuality";

export interface KnowledgeInsightSummary {
  tenantId: string;
  totalSources: number;
  enabledSources: number;
  totalAssets: number;
  activeAssets: number;
  archivedAssets: number;
  deprecatedAssets: number;
  averageQualityScore: number;
  restrictedAssets: number;
  confidentialAssets: number;
  generatedAt: string;
}

export function generateKnowledgeInsightSummary(input: {
  tenantId: string;
  sources: KnowledgeSource[];
  assets: KnowledgeAsset[];
}): KnowledgeInsightSummary {
  const tenantSources = input.sources.filter(
    (source) => source.metadata.tenantId === input.tenantId,
  );

  const tenantAssets = input.assets.filter(
    (asset) => asset.metadata.tenantId === input.tenantId,
  );

  const qualityScores = tenantAssets.map(
    (asset) => evaluateKnowledgeQuality(asset).totalScore,
  );

  const averageQualityScore =
    qualityScores.length === 0
      ? 0
      : Math.round(
          qualityScores.reduce((total, score) => total + score, 0) /
            qualityScores.length,
        );

  return {
    tenantId: input.tenantId,
    totalSources: tenantSources.length,
    enabledSources: tenantSources.filter((source) => source.enabled).length,
    totalAssets: tenantAssets.length,
    activeAssets: tenantAssets.filter((asset) => asset.status === "active").length,
    archivedAssets: tenantAssets.filter((asset) => asset.status === "archived").length,
    deprecatedAssets: tenantAssets.filter((asset) => asset.status === "deprecated").length,
    averageQualityScore,
    restrictedAssets: tenantAssets.filter(
      (asset) => asset.sensitivity === "restricted",
    ).length,
    confidentialAssets: tenantAssets.filter(
      (asset) => asset.sensitivity === "confidential",
    ).length,
    generatedAt: new Date().toISOString(),
  };
}

export function hasKnowledgeCoverageRisk(
  summary: KnowledgeInsightSummary,
): boolean {
  return (
    summary.totalAssets === 0 ||
    summary.activeAssets === 0 ||
    summary.averageQualityScore < 60
  );
}