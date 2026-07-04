import {
  AIExecutionAdaptationContext,
  AIExecutionAdaptationSeverity,
  AIExecutionAdaptationSignalType,
} from "./aiExecutionAdaptationTypes";

export interface AIExecutionAdaptationSignal {
  id: string;
  executionId: string;
  type: AIExecutionAdaptationSignalType;
  severity: AIExecutionAdaptationSeverity;
  confidenceScore: number;
  reason: string;
  detectedAt: Date;
  sourceMilestone?: string;
}

export interface AIExecutionAdaptationSignalInput {
  id: string;
  type: AIExecutionAdaptationSignalType;
  severity: AIExecutionAdaptationSeverity;
  confidenceScore: number;
  reason: string;
}

export function createAIExecutionAdaptationSignal(
  context: AIExecutionAdaptationContext,
  input: AIExecutionAdaptationSignalInput,
): AIExecutionAdaptationSignal {
  return {
    id: input.id,
    executionId: context.executionId,
    type: input.type,
    severity: input.severity,
    confidenceScore: Math.max(0, Math.min(1, input.confidenceScore)),
    reason: input.reason,
    detectedAt: context.observedAt,
    sourceMilestone: context.milestoneId,
  };
}

export function isCriticalAIExecutionAdaptationSignal(
  signal: AIExecutionAdaptationSignal,
): boolean {
  return signal.severity === "critical" || signal.confidenceScore >= 0.9;
}