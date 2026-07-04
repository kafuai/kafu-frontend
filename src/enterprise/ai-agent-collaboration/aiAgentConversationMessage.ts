export type AIAgentConversationMessageType =
  | "system"
  | "task"
  | "question"
  | "response"
  | "proposal"
  | "decision"
  | "review"
  | "approval"
  | "warning"
  | "error";

export interface AIAgentConversationMessage {
  id: string;
  conversationId: string;
  senderAgentId: string;
  recipientAgentId?: string;
  type: AIAgentConversationMessageType;
  content: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export function createAIAgentConversationMessage(
  message: AIAgentConversationMessage,
): AIAgentConversationMessage {
  if (!message.id.trim()) {
    throw new Error("Conversation message id is required");
  }

  if (!message.conversationId.trim()) {
    throw new Error("Conversation id is required");
  }

  if (!message.senderAgentId.trim()) {
    throw new Error("Sender agent id is required");
  }

  if (!message.content.trim()) {
    throw new Error("Conversation message content is required");
  }

  return message;
}