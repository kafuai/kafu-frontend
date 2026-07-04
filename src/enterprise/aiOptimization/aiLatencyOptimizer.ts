export interface AILatencyStep {
  id: string;
  name: string;
  averageLatencyMs: number;
  parallelizable: boolean;
  cacheable: boolean;
  required: boolean;
}

export interface AILatencyOptimizationResult {
  organizationId: string;
  originalLatencyMs: number;
  optimizedLatencyMs: number;
  estimatedReductionMs: number;
  estimatedReductionPercent: number;
  actions: Array<{
    stepId: string;
    action: "parallelize" | "cache" | "remove_optional_step";
    estimatedReductionMs: number;
  }>;
  createdAt: Date;
}

export function optimizeAILatency(
  organizationId: string,
  steps: AILatencyStep[],
): AILatencyOptimizationResult {
  const originalLatencyMs = steps.reduce((sum, step) => sum + step.averageLatencyMs, 0);

  const actions: AILatencyOptimizationResult["actions"] = [];

  for (const step of steps) {
    if (step.cacheable && step.averageLatencyMs > 500) {
      actions.push({
        stepId: step.id,
        action: "cache",
        estimatedReductionMs: step.averageLatencyMs * 0.6,
      });
    }

    if (step.parallelizable && step.averageLatencyMs > 700) {
      actions.push({
        stepId: step.id,
        action: "parallelize",
        estimatedReductionMs: step.averageLatencyMs * 0.35,
      });
    }

    if (!step.required && step.averageLatencyMs > 300) {
      actions.push({
        stepId: step.id,
        action: "remove_optional_step",
        estimatedReductionMs: step.averageLatencyMs,
      });
    }
  }

  const estimatedReductionMs = actions.reduce(
    (sum, action) => sum + action.estimatedReductionMs,
    0,
  );

  const optimizedLatencyMs = Math.max(0, originalLatencyMs - estimatedReductionMs);

  return {
    organizationId,
    originalLatencyMs,
    optimizedLatencyMs,
    estimatedReductionMs,
    estimatedReductionPercent:
      originalLatencyMs === 0 ? 0 : (estimatedReductionMs / originalLatencyMs) * 100,
    actions,
    createdAt: new Date(),
  };
}