import { KnowledgeAsset, KnowledgeSearchResult } from "./knowledgeTypes";

export interface KnowledgeContextBundle {
  tenantId: string;
  query: string;
  assets: KnowledgeAsset[];
  contextText: string;
  generatedAt: string;
}

export function buildKnowledgeContextBundle(
  tenantId: string,
  query: string,
  results: KnowledgeSearchResult[],
  maxCharacters = 4000,
): KnowledgeContextBundle {
  let currentLength = 0;
  const assets: KnowledgeAsset[] = [];
  const blocks: string[] = [];

  for (const result of results) {
    const block = [
      `Knowledge Asset: ${result.asset.title}`,
      `Summary: ${result.asset.summary}`,
      `Matched Fields: ${result.matchedFields.join(", ") || "none"}`,
      `Content: ${result.asset.content}`,
    ].join("\n");

    if (currentLength + block.length > maxCharacters) {
      break;
    }

    assets.push(result.asset);
    blocks.push(block);
    currentLength += block.length;
  }

  return {
    tenantId,
    query,
    assets,
    contextText: blocks.join("\n\n"),
    generatedAt: new Date().toISOString(),
  };
}

export function summarizeKnowledgeContext(bundle: KnowledgeContextBundle): string {
  return [
    `Knowledge context for query: ${bundle.query}`,
    `Tenant: ${bundle.tenantId}`,
    `Assets included: ${bundle.assets.length}`,
    `Generated at: ${bundle.generatedAt}`,
  ].join("\n");
}