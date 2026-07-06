import type { ConversationMessage } from "./conversationMessage";

export interface ConversationQualitySignal {
  readonly messageId: string;
  readonly clarityScore: number;
  readonly completenessScore: number;
  readonly groundednessScore: number;
  readonly notes: readonly string[];
}

export function evaluateConversationMessageQuality(
  message: ConversationMessage,
): ConversationQualitySignal {
  const contentLength = message.content.trim().length;

  return {
    messageId: message.id,
    clarityScore: contentLength > 20 ? 0.85 : 0.55,
    completenessScore: contentLength > 80 ? 0.82 : 0.6,
    groundednessScore: message.context.length > 0 ? 0.88 : 0.62,
    notes:
      message.context.length > 0
        ? ["Message includes context references."]
        : ["Message has no attached context references."],
  };
}