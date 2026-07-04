import {
  AIExecutionObservabilitySeverity,
  AIExecutionObservabilitySignal,
  AIExecutionObservabilitySignalType,
  AIExecutionObservabilitySource,
} from "./aiAutonomousExecutionObservabilityTypes";

export interface CreateAIExecutionObservabilitySignalInput {
  type: AIExecutionObservabilitySignalType;
  source: AIExecutionObservabilitySource;
  severity: AIExecutionObservabilitySeverity;
  title: string;
  description: string;
  confidence: number;
  executionId?: string;
  tenantId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export function createAIExecutionObservabilitySignal(
  input: CreateAIExecutionObservabilitySignalInput,
): AIExecutionObservabilitySignal {
  return {
    id: `obs_signal_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    type: input.type,
    source: input.source,
    severity: input.severity,
    title: input.title,
    description: input.description,
    confidence: Math.max(0, Math.min(1, input.confidence)),
    observedAt: new Date().toISOString(),
    executionId: input.executionId,
    tenantId: input.tenantId,
    metadata: input.metadata,
  };
}

export function isCriticalAIExecutionObservabilitySignal(
  signal: AIExecutionObservabilitySignal,
): boolean {
  return signal.severity === "critical" || signal.confidence >= 0.9;
}