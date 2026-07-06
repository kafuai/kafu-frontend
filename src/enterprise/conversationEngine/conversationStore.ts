import type { ConversationMessage } from "./conversationMessage";
import type { ConversationSession } from "./conversationSession";

export interface ConversationStore {
  readonly sessions: readonly ConversationSession[];
  readonly messages: readonly ConversationMessage[];
}

export function createConversationStore(input?: {
  readonly sessions?: readonly ConversationSession[];
  readonly messages?: readonly ConversationMessage[];
}): ConversationStore {
  return {
    sessions: input?.sessions ?? [],
    messages: input?.messages ?? [],
  };
}

export function addSessionToConversationStore(
  store: ConversationStore,
  session: ConversationSession,
): ConversationStore {
  const exists = store.sessions.some((item) => item.id === session.id);

  if (exists) {
    return store;
  }

  return {
    ...store,
    sessions: [...store.sessions, session],
  };
}

export function addMessageToConversationStore(
  store: ConversationStore,
  message: ConversationMessage,
): ConversationStore {
  const exists = store.messages.some((item) => item.id === message.id);

  if (exists) {
    return store;
  }

  return {
    ...store,
    messages: [...store.messages, message],
  };
}

export function listMessagesForConversation(
  store: ConversationStore,
  conversationId: string,
): readonly ConversationMessage[] {
  return store.messages
    .filter((message) => message.conversationId === conversationId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function findSessionInConversationStore(
  store: ConversationStore,
  sessionId: string,
): ConversationSession | undefined {
  return store.sessions.find((session) => session.id === sessionId);
}