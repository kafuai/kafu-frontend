import {
  KnowledgeAsset,
  KnowledgeSearchQuery,
  KnowledgeSearchResult,
} from "./knowledgeTypes";
import { searchKnowledgeAssets } from "./knowledgeSearch";

export interface KnowledgeRetrievalContext {
  tenantId: string;
  userId: string;
  allowedSensitivity: string[];
  preferredTags?: string[];
}

export function retrieveKnowledge(
  assets: KnowledgeAsset[],
  context: KnowledgeRetrievalContext,
  text: string,
  limit = 10,
): KnowledgeSearchResult[] {
  return searchKnowledgeAssets(assets, {
    tenantId: context.tenantId,
    text,
    limit,
    tags: context.preferredTags,
    sensitivity: context.allowedSensitivity as KnowledgeSearchQuery["sensitivity"],
    status: ["active"],
  });
}

export function retrieveKnowledgeByTags(
  assets: KnowledgeAsset[],
  context: KnowledgeRetrievalContext,
  tags: string[],
  limit = 10,
): KnowledgeSearchResult[] {
  return searchKnowledgeAssets(assets, {
    tenantId: context.tenantId,
    text: tags.join(" "),
    tags,
    limit,
    sensitivity: context.allowedSensitivity as KnowledgeSearchQuery["sensitivity"],
    status: ["active"],
  });
}

export function retrieveKnowledgeForPrompt(
  results: KnowledgeSearchResult[],
  maxCharacters = 4000,
): string {
  let currentLength = 0;
  const sections: string[] = [];

  for (const result of results) {
    const section = [
      `Title: ${result.asset.title}`,
      `Summary: ${result.asset.summary}`,
      `Content: ${result.asset.content}`,
      `Confidence: ${result.asset.confidence}`,
      `Source: ${result.asset.sourceId}`,
    ].join("\n");

    if (currentLength + section.length > maxCharacters) {
      break;
    }

    sections.push(section);
    currentLength += section.length;
  }

  return sections.join("\n\n---\n\n");
}