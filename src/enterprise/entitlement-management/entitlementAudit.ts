import { EntitlementEvent } from "./entitlementEvent";

export interface EntitlementAuditEntry extends EntitlementEvent {
  actorId: string;
  ipAddress?: string;
  userAgent?: string;
}

export function createEntitlementAuditEntry(
  entry: EntitlementAuditEntry,
): EntitlementAuditEntry {
  return entry;
}