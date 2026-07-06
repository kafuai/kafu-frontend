import {
  KnowledgeGraphConfidence,
  KnowledgeGraphRelationType,
} from "./knowledgeGraphTypes";

export interface KnowledgeGraphRelation {
  readonly id: string;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly type: KnowledgeGraphRelationType;
  readonly description: string;
  readonly confidence: KnowledgeGraphConfidence;
  readonly sourceModule: string;
  readonly createdAt: string;
}

export function createKnowledgeGraphRelation(
  relation: KnowledgeGraphRelation,
): KnowledgeGraphRelation {
  return { ...relation };
}