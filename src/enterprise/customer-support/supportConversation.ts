export interface SupportConversation {
  id: string;
  ticketId: string;
  customerId: string;
  agentId?: string;
  startedAt: Date;
  endedAt?: Date;
}

export function isConversationActive(
  conversation: SupportConversation,
): boolean {
  return !conversation.endedAt;
}
