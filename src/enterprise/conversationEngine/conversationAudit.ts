export type ConversationAuditAction =
  | "conversation_started"
  | "message_created"
  | "turn_completed"
  | "conversation_paused"
  | "conversation_completed"
  | "conversation_archived"
  | "policy_blocked";

export interface ConversationAuditEvent {
  readonly id: string;
  readonly conversationId: string;
  readonly actorId: string;
  readonly action: ConversationAuditAction;
  readonly description: string;
  readonly createdAt: string;
}

export function createConversationAuditEvent(input: {
  readonly id: string;
  readonly conversationId: string;
  readonly actorId: string;
  readonly action: ConversationAuditAction;
  readonly description: string;
  readonly createdAt?: string;
}): ConversationAuditEvent {
  return {
    id: input.id,
    conversationId: input.conversationId,
    actorId: input.actorId,
    action: input.action,
    description: input.description,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}