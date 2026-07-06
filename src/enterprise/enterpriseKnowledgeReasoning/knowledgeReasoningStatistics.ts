import { KnowledgeReasoningConclusion } from "./knowledgeReasoningConclusion";
import { KnowledgeReasoningFact } from "./knowledgeReasoningFact";
import { KnowledgeReasoningRule } from "./knowledgeReasoningRule";

export interface KnowledgeReasoningStatistics {
  readonly factCount: number;
  readonly ruleCount: number;
  readonly conclusionCount: number;
  readonly averageFactsPerConclusion: number;
}

export function calculateKnowledgeReasoningStatistics(
  facts: readonly KnowledgeReasoningFact[],
  rules: readonly KnowledgeReasoningRule[],
  conclusions: readonly KnowledgeReasoningConclusion[],
): KnowledgeReasoningStatistics {
  return {
    factCount: facts.length,
    ruleCount: rules.length,
    conclusionCount: conclusions.length,
    averageFactsPerConclusion:
      conclusions.length === 0
        ? 0
        : facts.length / conclusions.length,
  };
}