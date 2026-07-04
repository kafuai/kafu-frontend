import {
  KnowledgeAsset,
  KnowledgeAssetStatus,
  KnowledgeConfidenceLevel,
  KnowledgeMetadata,
  KnowledgeSensitivity,
  KnowledgeValidationResult,
} from "./knowledgeTypes";

export interface CreateKnowledgeAssetInput {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceId: string;
  tenantId: string;
  ownerId: string;
  sensitivity?: KnowledgeSensitivity;
  confidence?: KnowledgeConfidenceLevel;
  status?: KnowledgeAssetStatus;
  tags?: string[];
}

export function createKnowledgeAsset(
  input: CreateKnowledgeAssetInput,
): KnowledgeAsset {
  const now = new Date().toISOString();

  const metadata: KnowledgeMetadata = {
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    createdAt: now,
    updatedAt: now,
    version: 1,
    tags: input.tags ?? [],
  };

  return {
    id: input.id,
    title: input.title,
    summary: input.summary,
    content: input.content,
    sourceId: input.sourceId,
    status: input.status ?? "draft",
    sensitivity: input.sensitivity ?? "internal",
    confidence: input.confidence ?? "medium",
    metadata,
  };
}

export function validateKnowledgeAsset(
  asset: KnowledgeAsset,
): KnowledgeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!asset.id.trim()) {
    errors.push("Knowledge asset id is required.");
  }

  if (!asset.title.trim()) {
    errors.push("Knowledge asset title is required.");
  }

  if (!asset.content.trim()) {
    errors.push("Knowledge asset content is required.");
  }

  if (!asset.sourceId.trim()) {
    errors.push("Knowledge asset sourceId is required.");
  }

  if (!asset.summary.trim()) {
    warnings.push("Knowledge asset summary is empty.");
  }

  if (asset.content.length < 30) {
    warnings.push("Knowledge asset content may be too short.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function activateKnowledgeAsset(asset: KnowledgeAsset): KnowledgeAsset {
  return updateKnowledgeAssetStatus(asset, "active");
}

export function archiveKnowledgeAsset(asset: KnowledgeAsset): KnowledgeAsset {
  return updateKnowledgeAssetStatus(asset, "archived");
}

export function deprecateKnowledgeAsset(asset: KnowledgeAsset): KnowledgeAsset {
  return updateKnowledgeAssetStatus(asset, "deprecated");
}

export function updateKnowledgeAssetStatus(
  asset: KnowledgeAsset,
  status: KnowledgeAssetStatus,
): KnowledgeAsset {
  return {
    ...asset,
    status,
    metadata: {
      ...asset.metadata,
      updatedAt: new Date().toISOString(),
      version: asset.metadata.version + 1,
    },
  };
}