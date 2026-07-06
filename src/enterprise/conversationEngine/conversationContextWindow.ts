import type { ConversationMessage } from "./conversationMessage";
import type { ConversationSession } from "./conversationSession";

export interface ConversationContextWindow {
  readonly conversationId: string;
  readonly messages: readonly ConversationMessage[];
  readonly maxMessages: number;
}

export function buildConversationContextWindow(input: {
  readonly session: ConversationSession;
  readonly messages: readonly ConversationMessage[];
}): ConversationContextWindow {
  const maxMessages = Math.max(1, input.session.configuration.maxContextMessages);

  return {
    conversationId: input.session.id,
    messages: input.messages.slice(-maxMessages),
    maxMessages,
  };
}

export function countConversationContextMessages(
  window: ConversationContextWindow,
): number {
  return window.messages.length;
}

export function conversationContextText(
  window: ConversationContextWindow,
): string {
  return window.messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");
}