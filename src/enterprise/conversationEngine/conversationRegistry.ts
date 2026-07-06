import type { ConversationSession } from "./conversationSession";

export interface ConversationRegistry {
  readonly sessions: readonly ConversationSession[];
}

export function createConversationRegistry(
  sessions: readonly ConversationSession[] = [],
): ConversationRegistry {
  return {
    sessions,
  };
}

export function registerConversationSession(
  registry: ConversationRegistry,
  session: ConversationSession,
): ConversationRegistry {
  const exists = registry.sessions.some((item) => item.id === session.id);

  if (exists) {
    return registry;
  }

  return {
    sessions: [...registry.sessions, session],
  };
}

export function updateConversationSession(
  registry: ConversationRegistry,
  session: ConversationSession,
): ConversationRegistry {
  return {
    sessions: registry.sessions.map((item) =>
      item.id === session.id ? session : item,
    ),
  };
}

export function findConversationSession(
  registry: ConversationRegistry,
  sessionId: string,
): ConversationSession | undefined {
  return registry.sessions.find((session) => session.id === sessionId);
}

export function listActiveConversationSessions(
  registry: ConversationRegistry,
): readonly ConversationSession[] {
  return registry.sessions.filter((session) => session.status === "active");
}