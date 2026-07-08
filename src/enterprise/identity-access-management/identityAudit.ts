import type { IdentityAuditMetadata } from "./identityAccessManagementTypes";

export interface IdentityAuditEvent extends IdentityAuditMetadata {
  id: string;
  actorId: string;
  action: string;
  resource: string;
  outcome: "success" | "failure";
  occurredAt: string;
}

export const createIdentityAuditEvent = (
  event: IdentityAuditEvent
): IdentityAuditEvent => event;

export const isSuccessfulAuditEvent = (
  event: IdentityAuditEvent
): boolean => event.outcome === "success";

export const isFailedAuditEvent = (
  event: IdentityAuditEvent
): boolean => event.outcome === "failure";
