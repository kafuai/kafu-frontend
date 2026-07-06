import type {
  ConversationContextReference,
  ConversationRole,
  ConversationUsage,
} from "./conversationTypes";

export interface ConversationMessage {
  readonly id: string;
  readonly conversationId: string;
  readonly role: ConversationRole;
  readonly content: string;
  readonly createdAt: string;
  readonly context: readonly ConversationContextReference[];
  readonly usage?: ConversationUsage;
}

export interface CreateConversationMessageInput {
  readonly id: string;
  readonly conversationId: string;
  readonly role: ConversationRole;
  readonly content: string;
  readonly context?: readonly ConversationContextReference[];
  readonly usage?: ConversationUsage;
  readonly createdAt?: string;
}

export function createConversationMessage(
  input: CreateConversationMessageInput,
): ConversationMessage {
  return {
    id: input.id,
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    createdAt: input.createdAt ?? new Date().toISOString(),
    context: input.context ?? [],
    usage: input.usage,
  };
}

export function updateConversationMessageContent(
  message: ConversationMessage,
  content: string,
): ConversationMessage {
  return {
    ...message,
    content,
  };
}

export function attachConversationContext(
  message: ConversationMessage,
  references: readonly ConversationContextReference[],
): ConversationMessage {
  return {
    ...message,
    context: [...message.context, ...references],
  };
}

export function messageTokenUsage(
  message: ConversationMessage,
): ConversationUsage {
  return (
    message.usage ?? {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    }
  );
}