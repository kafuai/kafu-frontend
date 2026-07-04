import {
  AIExecutionMonitoringSeverity,
  AIExecutionMonitoringSignalType,
} from "./aiAutonomousExecutionMonitoringTypes";

export interface AIExecutionMonitoringSignal {
  id: string;
  executionId: string;
  type: AIExecutionMonitoringSignalType;
  severity: AIExecutionMonitoringSeverity;
  message: string;
  confidence: number;
  observedAt: Date;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface CreateAIExecutionMonitoringSignalInput {
  executionId: string;
  type: AIExecutionMonitoringSignalType;
  severity: AIExecutionMonitoringSeverity;
  message: string;
  confidence?: number;
  observedAt?: Date;
  source: string;
  metadata?: Record<string, unknown>;
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function createAIExecutionMonitoringSignal(
  input: CreateAIExecutionMonitoringSignalInput,
): AIExecutionMonitoringSignal {
  const observedAt = input.observedAt ?? new Date();

  return {
    id: `${input.executionId}-${input.type}-${observedAt.getTime()}`,
    executionId: input.executionId,
    type: input.type,
    severity: input.severity,
    message: input.message,
    confidence: clampConfidence(input.confidence ?? 1),
    observedAt,
    source: input.source,
    metadata: input.metadata,
  };
}

export function isCriticalAIExecutionMonitoringSignal(
  signal: AIExecutionMonitoringSignal,
): boolean {
  return signal.severity === "critical" && signal.confidence >= 0.7;
}

export function filterAIExecutionMonitoringSignalsByType(
  signals: AIExecutionMonitoringSignal[],
  type: AIExecutionMonitoringSignalType,
): AIExecutionMonitoringSignal[] {
  return signals.filter((signal) => signal.type === type);
}