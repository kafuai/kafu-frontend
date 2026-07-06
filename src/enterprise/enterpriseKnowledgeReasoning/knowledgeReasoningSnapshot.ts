import { KnowledgeReasoningConclusion } from "./knowledgeReasoningConclusion";
import { KnowledgeReasoningFact } from "./knowledgeReasoningFact";
import { KnowledgeReasoningRule } from "./knowledgeReasoningRule";

export interface KnowledgeReasoningSnapshot {
  readonly id: string;
  readonly createdAt: string;
  readonly facts: readonly KnowledgeReasoningFact[];
  readonly rules: readonly KnowledgeReasoningRule[];
  readonly conclusions: readonly KnowledgeReasoningConclusion[];
}

export function createKnowledgeReasoningSnapshot(
  id: string,
  facts: readonly KnowledgeReasoningFact[],
  rules: readonly KnowledgeReasoningRule[],
  conclusions: readonly KnowledgeReasoningConclusion[],
): KnowledgeReasoningSnapshot {
  return {
    id,
    createdAt: new Date().toISOString(),
    facts: [...facts],
    rules: [...rules],
    conclusions: [...conclusions],
  };
}