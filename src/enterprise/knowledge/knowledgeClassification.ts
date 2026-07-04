import {
  KnowledgeAsset,
  KnowledgeClassification,
  KnowledgeConfidenceLevel,
  KnowledgeSensitivity,
  KnowledgeTaxonomyNode,
} from "./knowledgeTypes";

export interface ClassifyKnowledgeAssetInput {
  asset: KnowledgeAsset;
  taxonomyNodes: KnowledgeTaxonomyNode[];
  classifiedBy: string;
  sensitivity?: KnowledgeSensitivity;
  confidence?: KnowledgeConfidenceLevel;
}

export function classifyKnowledgeAsset(
  input: ClassifyKnowledgeAssetInput,
): KnowledgeClassification {
  const assetTags = input.asset.metadata.tags.map((tag) => tag.toLowerCase());

  const matchedNodeIds = input.taxonomyNodes
    .filter((node) =>
      node.tags.some((tag) => assetTags.includes(tag.toLowerCase())),
    )
    .map((node) => node.id);

  return {
    assetId: input.asset.id,
    taxonomyNodeIds: matchedNodeIds,
    sensitivity: input.sensitivity ?? input.asset.sensitivity,
    confidence: input.confidence ?? input.asset.confidence,
    classifiedAt: new Date().toISOString(),
    classifiedBy: input.classifiedBy,
  };
}

export function isKnowledgeAssetClassified(
  classification: KnowledgeClassification,
): boolean {
  return classification.taxonomyNodeIds.length > 0;
}

export function updateKnowledgeClassificationSensitivity(
  classification: KnowledgeClassification,
  sensitivity: KnowledgeSensitivity,
  classifiedBy: string,
): KnowledgeClassification {
  return {
    ...classification,
    sensitivity,
    classifiedAt: new Date().toISOString(),
    classifiedBy,
  };
}

export function updateKnowledgeClassificationConfidence(
  classification: KnowledgeClassification,
  confidence: KnowledgeConfidenceLevel,
  classifiedBy: string,
): KnowledgeClassification {
  return {
    ...classification,
    confidence,
    classifiedAt: new Date().toISOString(),
    classifiedBy,
  };
}