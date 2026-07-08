import { EntitlementEvent } from "./entitlementEvent";

export interface EntitlementNotification {
  id: string;
  tenantId: string;
  entitlementId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export function createEntitlementNotification(
  id: string,
  event: EntitlementEvent,
): EntitlementNotification {
  return {
    id,
    tenantId: event.tenantId,
    entitlementId: event.entitlementId,
    message: event.message,
    createdAt: new Date(),
    read: false,
  };
}