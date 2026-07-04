import {
  KnowledgeAsset,
  KnowledgeSource,
  KnowledgeTaxonomyNode,
  KnowledgeValidationResult,
} from "./knowledgeTypes";
import { validateKnowledgeAsset } from "./knowledgeAsset";
import { validateKnowledgeSource } from "./knowledgeSource";

export function validateKnowledgeLayerInput(input: {
  sources: KnowledgeSource[];
  assets: KnowledgeAsset[];
  taxonomyNodes: KnowledgeTaxonomyNode[];
}): KnowledgeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceIds = new Set(input.sources.map((source) => source.id));
  const taxonomyIds = new Set(input.taxonomyNodes.map((node) => node.id));

  for (const source of input.sources) {
    const result = validateKnowledgeSource(source);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  for (const asset of input.assets) {
    const result = validateKnowledgeAsset(asset);
    errors.push(...result.errors);
    warnings.push(...result.warnings);

    if (!sourceIds.has(asset.sourceId)) {
      errors.push(`Knowledge asset ${asset.id} references missing source ${asset.sourceId}.`);
    }
  }

  for (const node of input.taxonomyNodes) {
    if (!node.id.trim()) {
      errors.push("Knowledge taxonomy node id is required.");
    }

    if (!node.name.trim()) {
      errors.push(`Knowledge taxonomy node ${node.id} name is required.`);
    }

    if (node.parentId && !taxonomyIds.has(node.parentId)) {
      errors.push(`Knowledge taxonomy node ${node.id} references missing parent ${node.parentId}.`);
    }

    for (const childId of node.childrenIds) {
      if (!taxonomyIds.has(childId)) {
        errors.push(`Knowledge taxonomy node ${node.id} references missing child ${childId}.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function mergeKnowledgeValidationResults(
  results: KnowledgeValidationResult[],
): KnowledgeValidationResult {
  const errors = results.flatMap((result) => result.errors);
  const warnings = results.flatMap((result) => result.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}