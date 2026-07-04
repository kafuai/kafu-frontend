import { AIAgentCollaborationEvent } from "./aiAgentCollaborationEvents";

export interface AIAgentCollaborationMetrics {
  teamId: string;
  totalEvents: number;
  messages: number;
  delegations: number;
  negotiations: number;
  consensusCompleted: number;
  conflicts: number;
  conflictsResolved: number;
  reviewsCompleted: number;
  approvalsCompleted: number;
}

export function calculateAIAgentCollaborationMetrics(
  teamId: string,
  events: AIAgentCollaborationEvent[],
): AIAgentCollaborationMetrics {
  const teamEvents = events.filter((event) => event.teamId === teamId);

  return {
    teamId,
    totalEvents: teamEvents.length,
    messages: teamEvents.filter((event) => event.type === "message_published").length,
    delegations: teamEvents.filter((event) => event.type === "delegation_created").length,
    negotiations: teamEvents.filter((event) => event.type === "negotiation_started").length,
    consensusCompleted: teamEvents.filter((event) => event.type === "consensus_completed").length,
    conflicts: teamEvents.filter((event) => event.type === "conflict_detected").length,
    conflictsResolved: teamEvents.filter((event) => event.type === "conflict_resolved").length,
    reviewsCompleted: teamEvents.filter((event) => event.type === "review_completed").length,
    approvalsCompleted: teamEvents.filter((event) => event.type === "approval_completed").length,
  };
}