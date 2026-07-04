import { AIExecutionObservabilityTrace } from "./aiAutonomousExecutionObservabilityTypes";

export interface CreateAIExecutionObservabilityTraceInput {
  executionId: string;
  spanName: string;
  attributes?: Record<string, string | number | boolean>;
}

export function createAIExecutionObservabilityTrace(
  input: CreateAIExecutionObservabilityTraceInput,
): AIExecutionObservabilityTrace {
  return {
    id: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    executionId: input.executionId,
    spanName: input.spanName,
    startedAt: new Date().toISOString(),
    status: "started",
    attributes: input.attributes,
  };
}

export function completeAIExecutionObservabilityTrace(
  trace: AIExecutionObservabilityTrace,
): AIExecutionObservabilityTrace {
  const endedAt = new Date().toISOString();

  return {
    ...trace,
    endedAt,
    durationMs:
      new Date(endedAt).getTime() - new Date(trace.startedAt).getTime(),
    status: "completed",
  };
}

export function failAIExecutionObservabilityTrace(
  trace: AIExecutionObservabilityTrace,
): AIExecutionObservabilityTrace {
  const endedAt = new Date().toISOString();

  return {
    ...trace,
    endedAt,
    durationMs:
      new Date(endedAt).getTime() - new Date(trace.startedAt).getTime(),
    status: "failed",
  };
}