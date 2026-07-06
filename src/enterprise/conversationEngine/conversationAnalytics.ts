import { messageTokenUsage, type ConversationMessage } from "./conversationMessage";
import type { ConversationSession } from "./conversationSession";

export interface ConversationAnalytics {
  readonly conversationId: string;
  readonly messageCount: number;
  readonly participantCount: number;
  readonly totalPromptTokens: number;
  readonly totalCompletionTokens: number;
  readonly totalTokens: number;
  readonly lastMessageAt: string;
}

export function analyzeConversation(input: {
  readonly session: ConversationSession;
  readonly messages: readonly ConversationMessage[];
}): ConversationAnalytics {
  const usage = input.messages
    .map(messageTokenUsage)
    .reduce(
      (total, item) => ({
        promptTokens: total.promptTokens + item.promptTokens,
        completionTokens: total.completionTokens + item.completionTokens,
        totalTokens: total.totalTokens + item.totalTokens,
      }),
      {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    );

  return {
    conversationId: input.session.id,
    messageCount: input.messages.length,
    participantCount: input.session.participants.length,
    totalPromptTokens: usage.promptTokens,
    totalCompletionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens,
    lastMessageAt: input.session.lastMessageAt,
  };
}