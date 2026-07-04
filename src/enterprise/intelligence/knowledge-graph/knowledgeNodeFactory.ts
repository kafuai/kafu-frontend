import {
  KnowledgeConfidenceLevel,
  KnowledgeNode,
  KnowledgeNodeType,
} from "./knowledgeGraphTypes";

type CreateKnowledgeNodeInput = {
  type: KnowledgeNodeType;
  title: string;
  description?: string;
  confidence?: KnowledgeConfidenceLevel;
  metadata?: Record<string, unknown>;
};

export class KnowledgeNodeFactory {
  createNode(input: CreateKnowledgeNodeInput): KnowledgeNode {
    const timestamp = new Date().toISOString();

    return {
      id: crypto.randomUUID(),
      type: input.type,
      title: input.title,
      description: input.description,
      confidence: input.confidence ?? "medium",
      metadata: input.metadata,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
}