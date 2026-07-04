import {
  ObservabilityContext,
  ObservabilityTraceSpan,
} from "./observabilityTypes";

export function startObservabilityTraceSpan(
  name: string,
  context: ObservabilityContext,
  parentSpanId?: string,
): ObservabilityTraceSpan {
  return {
    id: crypto.randomUUID(),
    traceId: context.traceId ?? crypto.randomUUID(),
    parentSpanId,
    name,
    startedAt: new Date(),
    context,
  };
}

export function endObservabilityTraceSpan(
  span: ObservabilityTraceSpan,
): ObservabilityTraceSpan {
  return {
    ...span,
    endedAt: new Date(),
  };
}