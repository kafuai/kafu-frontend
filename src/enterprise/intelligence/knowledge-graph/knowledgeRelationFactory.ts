import {
  KnowledgeConfidenceLevel,
  KnowledgeRelation,
  KnowledgeRelationType,
} from "./knowledgeGraphTypes";

type CreateKnowledgeRelationInput = {
  sourceNodeId: string;
  targetNodeId: string;
  type: KnowledgeRelationType;
  confidence?: KnowledgeConfidenceLevel;
  description?: string;
  metadata?: Record<string, unknown>;
};

export class KnowledgeRelationFactory {
  createRelation(input: CreateKnowledgeRelationInput): KnowledgeRelation {
    return {
      id: crypto.randomUUID(),
      sourceNodeId: input.sourceNodeId,
      targetNodeId: input.targetNodeId,
      type: input.type,
      confidence: input.confidence ?? "medium",
      description: input.description,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    };
  }
}