export type AIAgentCollaborationEventType =
  | "team_created"
  | "team_activated"
  | "message_published"
  | "delegation_created"
  | "negotiation_started"
  | "consensus_completed"
  | "conflict_detected"
  | "conflict_resolved"
  | "review_completed"
  | "approval_completed"
  | "runtime_completed";

export interface AIAgentCollaborationEvent {
  id: string;
  type: AIAgentCollaborationEventType;
  teamId: string;
  agentId?: string;
  description: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export function createAIAgentCollaborationEvent(
  event: AIAgentCollaborationEvent,
): AIAgentCollaborationEvent {
  if (!event.id.trim()) throw new Error("Collaboration event id is required");
  if (!event.teamId.trim()) throw new Error("Collaboration event team id is required");
  if (!event.description.trim()) throw new Error("Collaboration event description is required");

  return event;
}