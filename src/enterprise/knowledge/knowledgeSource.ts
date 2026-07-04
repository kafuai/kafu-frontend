import {
  KnowledgeMetadata,
  KnowledgeSource,
  KnowledgeSourceType,
  KnowledgeValidationResult,
} from "./knowledgeTypes";

export interface CreateKnowledgeSourceInput {
  id: string;
  name: string;
  type: KnowledgeSourceType;
  description: string;
  tenantId: string;
  ownerId: string;
  uri?: string;
  tags?: string[];
  enabled?: boolean;
}

export function createKnowledgeSource(
  input: CreateKnowledgeSourceInput,
): KnowledgeSource {
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
    name: input.name,
    type: input.type,
    description: input.description,
    uri: input.uri,
    enabled: input.enabled ?? true,
    metadata,
  };
}

export function validateKnowledgeSource(
  source: KnowledgeSource,
): KnowledgeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!source.id.trim()) {
    errors.push("Knowledge source id is required.");
  }

  if (!source.name.trim()) {
    errors.push("Knowledge source name is required.");
  }

  if (!source.description.trim()) {
    warnings.push("Knowledge source description is empty.");
  }

  if (!source.metadata.tenantId.trim()) {
    errors.push("Knowledge source tenantId is required.");
  }

  if (!source.metadata.ownerId.trim()) {
    errors.push("Knowledge source ownerId is required.");
  }

  if (source.type === "api" && !source.uri) {
    warnings.push("API knowledge source should define a uri.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function enableKnowledgeSource(source: KnowledgeSource): KnowledgeSource {
  return {
    ...source,
    enabled: true,
    metadata: {
      ...source.metadata,
      updatedAt: new Date().toISOString(),
      version: source.metadata.version + 1,
    },
  };
}

export function disableKnowledgeSource(source: KnowledgeSource): KnowledgeSource {
  return {
    ...source,
    enabled: false,
    metadata: {
      ...source.metadata,
      updatedAt: new Date().toISOString(),
      version: source.metadata.version + 1,
    },
  };
}