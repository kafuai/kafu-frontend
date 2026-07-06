import { KnowledgeReasoningConfidence } from "./knowledgeReasoningTypes";

export interface KnowledgeReasoningFact {
  readonly id: string;
  readonly subject: string;
  readonly predicate: string;
  readonly object: string;
  readonly confidence: KnowledgeReasoningConfidence;
  readonly sourceIds: readonly string[];
  readonly createdAt: string;
}

export function createKnowledgeReasoningFact(
  fact: KnowledgeReasoningFact,
): KnowledgeReasoningFact {
  return {
    ...fact,
    sourceIds: [...fact.sourceIds],
  };
}