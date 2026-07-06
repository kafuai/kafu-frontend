import type {
  ConversationChannel,
  ConversationConfiguration,
  ConversationMetadata,
  ConversationParticipant,
  ConversationPriority,
  ConversationStatus,
  ConversationSummary,
} from "./conversationTypes";

export interface ConversationSession {
  readonly id: string;
  readonly title: string;
  readonly status: ConversationStatus;
  readonly priority: ConversationPriority;
  readonly channel: ConversationChannel;
  readonly participants: readonly ConversationParticipant[];
  readonly configuration: ConversationConfiguration;
  readonly metadata: ConversationMetadata;
  readonly lastMessageAt: string;
}

export function createConversationSession(input: {
  readonly id: string;
  readonly title: string;
  readonly channel: ConversationChannel;
  readonly startedBy: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly participants: readonly ConversationParticipant[];
  readonly configuration?: Partial<ConversationConfiguration>;
  readonly priority?: ConversationPriority;
  readonly now?: string;
}): ConversationSession {
  const now = input.now ?? new Date().toISOString();

  return {
    id: input.id,
    title: input.title,
    status: "active",
    priority: input.priority ?? "normal",
    channel: input.channel,
    participants: input.participants,
    configuration: {
      memoryEnabled: true,
      reasoningEnabled: true,
      retrievalEnabled: true,
      toolCallingEnabled: false,
      maxContextMessages: 20,
      ...input.configuration,
    },
    metadata: {
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      createdAt: now,
      updatedAt: now,
      startedBy: input.startedBy,
      tags: [],
    },
    lastMessageAt: now,
  };
}

export function pauseConversationSession(
  session: ConversationSession,
  now: string = new Date().toISOString(),
): ConversationSession {
  return {
    ...session,
    status: "paused",
    metadata: {
      ...session.metadata,
      updatedAt: now,
    },
  };
}

export function completeConversationSession(
  session: ConversationSession,
  now: string = new Date().toISOString(),
): ConversationSession {
  return {
    ...session,
    status: "completed",
    metadata: {
      ...session.metadata,
      updatedAt: now,
    },
  };
}

export function archiveConversationSession(
  session: ConversationSession,
  now: string = new Date().toISOString(),
): ConversationSession {
  return {
    ...session,
    status: "archived",
    metadata: {
      ...session.metadata,
      updatedAt: now,
    },
  };
}

export function summarizeConversationSession(
  session: ConversationSession,
): ConversationSummary {
  return {
    id: session.id,
    title: session.title,
    status: session.status,
    priority: session.priority,
    channel: session.channel,
    lastMessageAt: session.lastMessageAt,
    participants: session.participants,
  };
}