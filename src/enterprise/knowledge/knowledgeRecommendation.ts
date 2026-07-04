import { KnowledgeAsset } from "./knowledgeTypes";
import { evaluateKnowledgeQuality } from "./knowledgeQuality";

export type KnowledgeRecommendationType =
  | "improve_quality"
  | "refresh_content"
  | "increase_confidence"
  | "add_summary"
  | "add_tags"
  | "review_sensitive_asset";

export interface KnowledgeRecommendation {
  id: string;
  assetId: string;
  type: KnowledgeRecommendationType;
  priority: "low" | "medium" | "high" | "critical";
  message: string;
  createdAt: string;
}

export function generateKnowledgeRecommendations(
  assets: KnowledgeAsset[],
): KnowledgeRecommendation[] {
  const recommendations: KnowledgeRecommendation[] = [];

  for (const asset of assets) {
    const quality = evaluateKnowledgeQuality(asset);

    if (quality.totalScore < 60) {
      recommendations.push({
        id: `${asset.id}-improve-quality`,
        assetId: asset.id,
        type: "improve_quality",
        priority: "high",
        message: "Knowledge asset quality score is below acceptable threshold.",
        createdAt: new Date().toISOString(),
      });
    }

    if (!asset.summary.trim()) {
      recommendations.push({
        id: `${asset.id}-add-summary`,
        assetId: asset.id,
        type: "add_summary",
        priority: "medium",
        message: "Knowledge asset should include a clear summary.",
        createdAt: new Date().toISOString(),
      });
    }

    if (asset.metadata.tags.length === 0) {
      recommendations.push({
        id: `${asset.id}-add-tags`,
        assetId: asset.id,
        type: "add_tags",
        priority: "medium",
        message: "Knowledge asset should include tags for better retrieval.",
        createdAt: new Date().toISOString(),
      });
    }

    if (asset.confidence === "low") {
      recommendations.push({
        id: `${asset.id}-increase-confidence`,
        assetId: asset.id,
        type: "increase_confidence",
        priority: "high",
        message: "Knowledge asset confidence is low and should be reviewed.",
        createdAt: new Date().toISOString(),
      });
    }

    if (
      asset.sensitivity === "restricted" ||
      asset.sensitivity === "confidential"
    ) {
      recommendations.push({
        id: `${asset.id}-review-sensitive`,
        assetId: asset.id,
        type: "review_sensitive_asset",
        priority: "medium",
        message: "Sensitive knowledge asset should be periodically reviewed.",
        createdAt: new Date().toISOString(),
      });
    }
  }

  return recommendations;
}

export function getHighPriorityKnowledgeRecommendations(
  recommendations: KnowledgeRecommendation[],
): KnowledgeRecommendation[] {
  return recommendations.filter(
    (recommendation) =>
      recommendation.priority === "high" ||
      recommendation.priority === "critical",
  );
}