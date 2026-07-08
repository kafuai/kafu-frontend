import { EntitlementEvent } from "./entitlementEvent";

export interface EntitlementHistory {
  entitlementId: string;
  events: EntitlementEvent[];
}

export function appendEntitlementHistory(
  history: EntitlementHistory,
  event: EntitlementEvent,
): EntitlementHistory {
  return {
    entitlementId: history.entitlementId,
    events: [...history.events, event],
  };
}