import { EnterpriseEventBus } from "./enterpriseEventBus";

export function getEnterpriseEventDiagnostics(eventBus: EnterpriseEventBus) {
  return {
    registeredEventCount: eventBus.getRegisteredEvents().length,
    registeredEvents: eventBus.getRegisteredEvents(),
  };
}