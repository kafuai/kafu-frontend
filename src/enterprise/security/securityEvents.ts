import { SecurityEvent } from "./securityTypes";

export function createSecurityEvent(
  event: SecurityEvent,
): SecurityEvent {
  return {
    ...event,
  };
}