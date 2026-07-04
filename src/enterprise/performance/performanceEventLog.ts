import { PerformanceEvent } from "./performanceEvents";

export type PerformanceEventLog = {
  events: PerformanceEvent[];
};

export function createPerformanceEventLog(
  events: PerformanceEvent[] = [],
): PerformanceEventLog {
  return {
    events,
  };
}

export function appendPerformanceEvent(
  log: PerformanceEventLog,
  event: PerformanceEvent,
): PerformanceEventLog {
  return {
    events: [...log.events, event],
  };
}

export function filterPerformanceEventsByOrganization(
  log: PerformanceEventLog,
  organizationId: string,
): PerformanceEvent[] {
  return log.events.filter((event) => event.organizationId === organizationId);
}