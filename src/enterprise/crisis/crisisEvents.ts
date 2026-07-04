export type CrisisEventType =
  | "crisis.declared"
  | "crisis.updated"
  | "crisis.escalated"
  | "crisis.commandActivated"
  | "crisis.communicationSent"
  | "crisis.contained"
  | "crisis.resolved"
  | "crisis.closed";

export type CrisisEvent = {
  id: string;
  organizationId: string;
  crisisId: string;
  type: CrisisEventType;
  occurredAt: string;
  actorId?: string;
  payload?: Record<string, unknown>;
};