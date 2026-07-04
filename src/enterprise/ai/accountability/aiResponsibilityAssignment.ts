import {
  AIAccountabilityActor,
  AIAccountabilityResponsibilityType,
  AIAccountabilityStatus,
  AIAccountabilityTimeWindow,
} from "./aiAccountabilityTypes";

export interface AIResponsibilityAssignment {
  id: string;
  organizationId: string;
  decisionId: string;
  actor: AIAccountabilityActor;
  responsibilityType: AIAccountabilityResponsibilityType;
  status: AIAccountabilityStatus;
  scope: string;
  timeWindow: AIAccountabilityTimeWindow;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIResponsibilityAssignmentInput {
  id: string;
  organizationId: string;
  decisionId: string;
  actor: AIAccountabilityActor;
  responsibilityType: AIAccountabilityResponsibilityType;
  scope: string;
  timeWindow: AIAccountabilityTimeWindow;
}

export function createAIResponsibilityAssignment(
  input: CreateAIResponsibilityAssignmentInput,
  now: Date = new Date(),
): AIResponsibilityAssignment {
  return {
    id: input.id,
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    actor: input.actor,
    responsibilityType: input.responsibilityType,
    status: "assigned",
    scope: input.scope,
    timeWindow: input.timeWindow,
    createdAt: now,
    updatedAt: now,
  };
}

export function acceptAIResponsibilityAssignment(
  assignment: AIResponsibilityAssignment,
  now: Date = new Date(),
): AIResponsibilityAssignment {
  return {
    ...assignment,
    status: "accepted",
    acceptedAt: now,
    rejectedAt: undefined,
    rejectionReason: undefined,
    updatedAt: now,
  };
}

export function rejectAIResponsibilityAssignment(
  assignment: AIResponsibilityAssignment,
  reason: string,
  now: Date = new Date(),
): AIResponsibilityAssignment {
  return {
    ...assignment,
    status: "remediation_required",
    rejectedAt: now,
    rejectionReason: reason,
    updatedAt: now,
  };
}

export function isResponsibilityActive(
  assignment: AIResponsibilityAssignment,
  at: Date = new Date(),
): boolean {
  const starts = assignment.timeWindow.startsAt.getTime();
  const ends = assignment.timeWindow.endsAt?.getTime();

  return at.getTime() >= starts && (ends === undefined || at.getTime() <= ends);
}