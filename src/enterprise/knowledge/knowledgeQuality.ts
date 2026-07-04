import { KnowledgeAsset } from "./knowledgeTypes";

export interface KnowledgeQualityScore {
  assetId: string;
  completenessScore: number;
  freshnessScore: number;
  confidenceScore: number;
  totalScore: number;
  evaluatedAt: string;
}

function mapConfidenceToScore(asset: KnowledgeAsset): number {
  switch (asset.confidence) {
    case "verified":
      return 100;
    case "high":
      return 85;
    case "medium":
      return 65;
    case "low":
      return 40;
    default:
      return 50;
  }
}

function calculateCompleteness(asset: KnowledgeAsset): number {
  let score = 0;

  if (asset.title.trim()) score += 20;
  if (asset.summary.trim()) score += 20;
  if (asset.content.trim()) score += 30;
  if (asset.metadata.tags.length > 0) score += 15;
  if (asset.sourceId.trim()) score += 15;

  return score;
}

function calculateFreshness(asset: KnowledgeAsset): number {
  const updatedAt = new Date(asset.metadata.updatedAt).getTime();

  if (Number.isNaN(updatedAt)) {
    return 40;
  }

  const ageInDays =
    (Date.now() - updatedAt) / (1000 * 60 * 60 * 24);

  if (ageInDays <= 30) return 100;
  if (ageInDays <= 90) return 85;
  if (ageInDays <= 180) return 70;
  if (ageInDays <= 365) return 55;

  return 35;
}

export function evaluateKnowledgeQuality(
  asset: KnowledgeAsset,
): KnowledgeQualityScore {
  const completenessScore = calculateCompleteness(asset);
  const freshnessScore = calculateFreshness(asset);
  const confidenceScore = mapConfidenceToScore(asset);

  const totalScore = Math.round(
    completenessScore * 0.4 +
      freshnessScore * 0.3 +
      confidenceScore * 0.3,
  );

  return {
    assetId: asset.id,
    completenessScore,
    freshnessScore,
    confidenceScore,
    totalScore,
    evaluatedAt: new Date().toISOString(),
  };
}

export function filterLowQualityKnowledgeAssets(
  assets: KnowledgeAsset[],
  minimumScore: number,
): KnowledgeAsset[] {
  return assets.filter(
    (asset) => evaluateKnowledgeQuality(asset).totalScore < minimumScore,
  );
}