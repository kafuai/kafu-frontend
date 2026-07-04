import { AIExecutionObservabilityMetric } from "./aiAutonomousExecutionObservabilityTypes";

export interface CreateAIExecutionObservabilityMetricInput {
  name: string;
  value: number;
  unit: string;
  executionId?: string;
  tenantId?: string;
  tags?: Record<string, string>;
}

export function createAIExecutionObservabilityMetric(
  input: CreateAIExecutionObservabilityMetricInput,
): AIExecutionObservabilityMetric {
  return {
    id: `obs_metric_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    name: input.name,
    value: Number.isFinite(input.value) ? input.value : 0,
    unit: input.unit,
    capturedAt: new Date().toISOString(),
    executionId: input.executionId,
    tenantId: input.tenantId,
    tags: input.tags,
  };
}

export function normalizeAIExecutionObservabilityMetricValue(
  metric: AIExecutionObservabilityMetric,
  maxExpectedValue: number,
): number {
  if (maxExpectedValue <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, metric.value / maxExpectedValue));
}