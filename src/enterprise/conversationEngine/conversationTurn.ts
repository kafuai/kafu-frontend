import {
  createConversationMessage,
  type ConversationMessage,
} from "./conversationMessage";
import type { ConversationContextReference, ConversationUsage } from "./conversationTypes";

export interface ConversationTurn {
  readonly id: string;
  readonly conversationId: string;
  readonly userMessage: ConversationMessage;
  readonly assistantMessage?: ConversationMessage;
  readonly startedAt: string;
  readonly completedAt?: string;
}

export function startConversationTurn(input: {
  readonly id: string;
  readonly conversationId: string;
  readonly userMessageId: string;
  readonly userContent: string;
  readonly context?: readonly ConversationContextReference[];
  readonly startedAt?: string;
}): ConversationTurn {
  const startedAt = input.startedAt ?? new Date().toISOString();

  return {
    id: input.id,
    conversationId: input.conversationId,
    startedAt,
    userMessage: createConversationMessage({
      id: input.userMessageId,
      conversationId: input.conversationId,
      role: "user",
      content: input.userContent,
      context: input.context,
      createdAt: startedAt,
    }),
  };
}

export function completeConversationTurn(input: {
  readonly turn: ConversationTurn;
  readonly assistantMessageId: string;
  readonly assistantContent: string;
  readonly usage?: ConversationUsage;
  readonly completedAt?: string;
}): ConversationTurn {
  const completedAt = input.completedAt ?? new Date().toISOString();

  return {
    ...input.turn,
    completedAt,
    assistantMessage: createConversationMessage({
      id: input.assistantMessageId,
      conversationId: input.turn.conversationId,
      role: "assistant",
      content: input.assistantContent,
      usage: input.usage,
      createdAt: completedAt,
    }),
  };
}