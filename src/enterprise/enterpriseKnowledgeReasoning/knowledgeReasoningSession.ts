import { KnowledgeReasoningContext } from "./knowledgeReasoningTypes";

export interface KnowledgeReasoningSession {
  readonly id: string;
  readonly context: KnowledgeReasoningContext;
  readonly factIds: readonly string[];
  readonly ruleIds: readonly string[];
  readonly conclusionIds: readonly string[];
  readonly startedAt: string;
  readonly completedAt?: string;
}

export function createKnowledgeReasoningSession(
  session: KnowledgeReasoningSession,
): KnowledgeReasoningSession {
  return {
    ...session,
    factIds: [...session.factIds],
    ruleIds: [...session.ruleIds],
    conclusionIds: [...session.conclusionIds],
  };
}