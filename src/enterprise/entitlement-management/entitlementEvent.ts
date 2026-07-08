export type EntitlementEventType =
  | "created"
  | "updated"
  | "assigned"
  | "revoked"
  | "evaluated"
  | "expired";

export interface EntitlementEvent {
  id: string;
  entitlementId: string;
  tenantId: string;
  type: EntitlementEventType;
  message: string;
  createdAt: Date;
}