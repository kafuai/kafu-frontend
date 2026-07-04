import {
  KnowledgeAsset,
  KnowledgeSearchQuery,
  KnowledgeSearchResult,
} from "./knowledgeTypes";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function calculateFieldScore(field: string, query: string, weight: number): number {
  const normalizedField = normalizeText(field);
  const normalizedQuery = normalizeText(query);

  if (!normalizedField || !normalizedQuery) {
    return 0;
  }

  if (normalizedField === normalizedQuery) {
    return weight;
  }

  if (normalizedField.includes(normalizedQuery)) {
    return Math.round(weight * 0.8);
  }

  const queryTerms = normalizedQuery.split(/\s+/);
  const matchedTerms = queryTerms.filter((term) =>
    normalizedField.includes(term),
  );

  return Math.round((matchedTerms.length / queryTerms.length) * weight * 0.6);
}

function getMatchedFields(asset: KnowledgeAsset, query: string): string[] {
  const fields: string[] = [];

  if (calculateFieldScore(asset.title, query, 40) > 0) fields.push("title");
  if (calculateFieldScore(asset.summary, query, 25) > 0) fields.push("summary");
  if (calculateFieldScore(asset.content, query, 20) > 0) fields.push("content");

  const tagText = asset.metadata.tags.join(" ");
  if (calculateFieldScore(tagText, query, 15) > 0) fields.push("tags");

  return fields;
}

export function searchKnowledgeAssets(
  assets: KnowledgeAsset[],
  query: KnowledgeSearchQuery,
): KnowledgeSearchResult[] {
  const limit = query.limit ?? 20;

  return assets
    .filter((asset) => asset.metadata.tenantId === query.tenantId)
    .filter((asset) =>
      query.sourceIds ? query.sourceIds.includes(asset.sourceId) : true,
    )
    .filter((asset) =>
      query.sensitivity ? query.sensitivity.includes(asset.sensitivity) : true,
    )
    .filter((asset) =>
      query.status ? query.status.includes(asset.status) : true,
    )
    .filter((asset) =>
      query.tags
        ? query.tags.some((tag) =>
            asset.metadata.tags
              .map((assetTag) => assetTag.toLowerCase())
              .includes(tag.toLowerCase()),
          )
        : true,
    )
    .map((asset) => {
      const score =
        calculateFieldScore(asset.title, query.text, 40) +
        calculateFieldScore(asset.summary, query.text, 25) +
        calculateFieldScore(asset.content, query.text, 20) +
        calculateFieldScore(asset.metadata.tags.join(" "), query.text, 15);

      return {
        asset,
        score,
        matchedFields: getMatchedFields(asset, query.text),
      };
    })
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, limit);
}

export function getTopKnowledgeSearchResult(
  results: KnowledgeSearchResult[],
): KnowledgeSearchResult | undefined {
  return [...results].sort((first, second) => second.score - first.score)[0];
}