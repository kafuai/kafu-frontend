import { createConversationMessage } from "./conversationMessage";
import {
  createConversationSession,
  type ConversationSession,
} from "./conversationSession";
import type {
  ConversationChannel,
  ConversationConfiguration,
  ConversationParticipant,
  ConversationPriority,
  ConversationRole,
} from "./conversationTypes";

export interface CreateEnterpriseConversationInput {
  readonly id: string;
  readonly title: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly startedBy: string;
  readonly channel: ConversationChannel;
  readonly participants: readonly ConversationParticipant[];
  readonly openingMessage?: string;
  readonly openingRole?: ConversationRole;
  readonly configuration?: Partial<ConversationConfiguration>;
  readonly priority?: ConversationPriority;
  readonly now?: string;
}

export function createEnterpriseConversation(
  input: CreateEnterpriseConversationInput,
): {
  readonly session: ConversationSession;
  readonly openingMessage?: ReturnType<typeof createConversationMessage>;
} {
  const now = input.now ?? new Date().toISOString();

  const session = createConversationSession({
    id: input.id,
    title: input.title,
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    startedBy: input.startedBy,
    channel: input.channel,
    participants: input.participants,
    configuration: input.configuration,
    priority: input.priority,
    now,
  });

  if (!input.openingMessage) {
    return {
      session,
    };
  }

  return {
    session,
    openingMessage: createConversationMessage({
      id: `${input.id}-opening-message`,
      conversationId: input.id,
      role: input.openingRole ?? "user",
      content: input.openingMessage,
      createdAt: now,
    }),
  };
}