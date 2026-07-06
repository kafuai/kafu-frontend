import {
  buildConversationContextWindow,
  conversationContextText,
} from "./conversationContextWindow";
import { detectConversationIntent, type ConversationIntent } from "./conversationIntent";
import {
  completeConversationTurn,
  startConversationTurn,
  type ConversationTurn,
} from "./conversationTurn";
import { evaluateConversationPolicy, type ConversationPolicyDecision } from "./conversationPolicy";
import type { ConversationMessage } from "./conversationMessage";
import type { ConversationSession } from "./conversationSession";

export interface ConversationOrchestrationResult {
  readonly turn: ConversationTurn;
  readonly intent: ConversationIntent;
  readonly policy: ConversationPolicyDecision;
  readonly contextText: string;
}

export function orchestrateConversationTurn(input: {
  readonly session: ConversationSession;
  readonly messages: readonly ConversationMessage[];
  readonly turnId: string;
  readonly userMessageId: string;
  readonly assistantMessageId: string;
  readonly userContent: string;
  readonly assistantContent: string;
  readonly now?: string;
}): ConversationOrchestrationResult {
  const now = input.now ?? new Date().toISOString();

  const intent = detectConversationIntent(input.userContent);
  const policy = evaluateConversationPolicy({
    session: input.session,
    intent,
  });

  const startedTurn = startConversationTurn({
    id: input.turnId,
    conversationId: input.session.id,
    userMessageId: input.userMessageId,
    userContent: input.userContent,
    startedAt: now,
  });

  const contextWindow = buildConversationContextWindow({
    session: input.session,
    messages: [...input.messages, startedTurn.userMessage],
  });

  const turn = completeConversationTurn({
    turn: startedTurn,
    assistantMessageId: input.assistantMessageId,
    assistantContent: policy.allowed
      ? input.assistantContent
      : `Conversation blocked: ${policy.reason}`,
    completedAt: now,
  });

  return {
    turn,
    intent,
    policy,
    contextText: conversationContextText(contextWindow),
  };
}