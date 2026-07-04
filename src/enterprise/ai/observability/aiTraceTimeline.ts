import { AITraceEvent } from "./aiTraceEvent";

export interface AITraceTimeline {
  traceId: string;
  requestId: string;
  organizationId: string;
  serviceName: string;
  environment: string;
  events: AITraceEvent[];
  startedAt?: Date;
  completedAt?: Date;
  totalDurationMs: number;
  failed: boolean;
}

export function buildAITraceTimeline(
  events: AITraceEvent[],
): AITraceTimeline | undefined {
  if (events.length === 0) {
    return undefined;
  }

  const sortedEvents = [...events].sort(
    (first, second) => first.startedAt.getTime() - second.startedAt.getTime(),
  );

  const firstEvent = sortedEvents[0];
  const lastCompletedEvent = [...sortedEvents]
    .reverse()
    .find((event) => event.completedAt);

  const completedAt = lastCompletedEvent?.completedAt;
  const startedAt = firstEvent.startedAt;

  return {
    traceId: firstEvent.traceId,
    requestId: firstEvent.requestId,
    organizationId: firstEvent.organizationId,
    serviceName: firstEvent.serviceName,
    environment: firstEvent.environment,
    events: sortedEvents,
    startedAt,
    completedAt,
    totalDurationMs: completedAt
      ? completedAt.getTime() - startedAt.getTime()
      : 0,
    failed: sortedEvents.some((event) => event.phase === "failed"),
  };
}