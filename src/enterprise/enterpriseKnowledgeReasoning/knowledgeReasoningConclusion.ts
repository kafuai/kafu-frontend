import {
  KnowledgeReasoningConfidence,
  KnowledgeReasoningSeverity,
} from "./knowledgeReasoningTypes";

export interface KnowledgeReasoningConclusion {
  readonly id: string;
  readonly ruleId: string;
  readonly title: string;
  readonly explanation: string;
  readonly confidence: KnowledgeReasoningConfidence;
  readonly severity: KnowledgeReasoningSeverity;
  readonly evidenceFactIds: readonly string[];
  readonly createdAt: string;
}

export function createKnowledgeReasoningConclusion(
  conclusion: KnowledgeReasoningConclusion,
): KnowledgeReasoningConclusion {
  return {
    ...conclusion,
    evidenceFactIds: [...conclusion.evidenceFactIds],
  };
}