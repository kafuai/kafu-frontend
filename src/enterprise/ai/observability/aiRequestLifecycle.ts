import { AITraceEvent, AITraceEventPhase } from "./aiTraceEvent";

export interface AIRequestLifecycleSummary {
  requestId: string;
  traceId: string;
  completed: boolean;
  failed: boolean;
  missingPhases: AITraceEventPhase[];
  observedPhases: AITraceEventPhase[];
}

const REQUIRED_AI_REQUEST_PHASES: AITraceEventPhase[] = [
  "received",
  "validated",
  "routed",
  "model_invoked",
  "response_generated",
  "completed",
];

export function summarizeAIRequestLifecycle(
  events: AITraceEvent[],
): AIRequestLifecycleSummary | undefined {
  if (events.length === 0) {
    return undefined;
  }

  const observedPhases = Array.from(
    new Set(events.map((event) => event.phase)),
  );

  return {
    requestId: events[0].requestId,
    traceId: events[0].traceId,
    completed: observedPhases.includes("completed"),
    failed: observedPhases.includes("failed"),
    observedPhases,
    missingPhases: REQUIRED_AI_REQUEST_PHASES.filter(
      (phase) => !observedPhases.includes(phase),
    ),
  };
}