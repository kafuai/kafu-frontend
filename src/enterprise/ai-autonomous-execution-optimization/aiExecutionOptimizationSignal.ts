import {
  AIExecutionOptimizationAuditMetadata,
  AIExecutionOptimizationSignalType,
} from "./aiAutonomousExecutionOptimizationTypes";

export interface AIExecutionOptimizationSignal {
  id: string;
  type: AIExecutionOptimizationSignalType;
  sourceExecutionId: string;
  metricName: string;
  observedValue: number;
  baselineValue: number;
  severity: number;
  confidence: number;
  detectedAt: Date;
  metadata: AIExecutionOptimizationAuditMetadata;
}

export interface AIExecutionOptimizationSignalInput {
  id: string;
  type: AIExecutionOptimizationSignalType;
  sourceExecutionId: string;
  metricName: string;
  observedValue: number;
  baselineValue: number;
  severity: number;
  confidence: number;
  detectedAt?: Date;
  createdBy: string;
  sourceMilestone?: string;
  sourceLayer?: string;
}

export function createAIExecutionOptimizationSignal(
  input: AIExecutionOptimizationSignalInput,
): AIExecutionOptimizationSignal {
  if (!input.id.trim()) {
    throw new Error("Execution optimization signal id is required");
  }

  if (!input.sourceExecutionId.trim()) {
    throw new Error("Execution optimization signal sourceExecutionId is required");
  }

  if (!input.metricName.trim()) {
    throw new Error("Execution optimization signal metricName is required");
  }

  return {
    id: input.id,
    type: input.type,
    sourceExecutionId: input.sourceExecutionId,
    metricName: input.metricName,
    observedValue: input.observedValue,
    baselineValue: input.baselineValue,
    severity: clampOptimizationRatio(input.severity),
    confidence: clampOptimizationRatio(input.confidence),
    detectedAt: input.detectedAt ?? new Date(),
    metadata: {
      createdAt: new Date(),
      createdBy: input.createdBy,
      sourceMilestone: input.sourceMilestone,
      sourceLayer: input.sourceLayer,
    },
  };
}

export function calculateAIExecutionOptimizationDrift(
  signal: AIExecutionOptimizationSignal,
): number {
  if (signal.baselineValue === 0) {
    return signal.observedValue === 0 ? 0 : 1;
  }

  return Math.abs(signal.observedValue - signal.baselineValue) / Math.abs(signal.baselineValue);
}

function clampOptimizationRatio(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}