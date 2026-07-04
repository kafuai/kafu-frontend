import { AIAgentConversationMessage } from "./aiAgentConversationMessage";

export interface AIAgentConversation {
  id: string;
  teamId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: AIAgentConversationMessage[];
}

export function createAIAgentConversation(
  id: string,
  teamId: string,
  title: string,
): AIAgentConversation {
  if (!id.trim()) {
    throw new Error("Conversation id is required");
  }

  if (!teamId.trim()) {
    throw new Error("Team id is required");
  }

  const now = new Date();

  return {
    id,
    teamId,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function addAIAgentConversationMessage(
  conversation: AIAgentConversation,
  message: AIAgentConversationMessage,
): AIAgentConversation {
  return {
    ...conversation,
    updatedAt: new Date(),
    messages: [...conversation.messages, message],
  };
}

export function listAIAgentConversationMessages(
  conversation: AIAgentConversation,
): AIAgentConversationMessage[] {
  return [...conversation.messages];
}