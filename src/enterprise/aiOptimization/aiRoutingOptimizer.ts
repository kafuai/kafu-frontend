export interface AIRoutingRule {
  id: string;
  workloadType: string;
  complexity: "low" | "medium" | "high";
  preferredModelId: string;
  fallbackModelId?: string;
  maxLatencyMs?: number;
  maxCostUsd?: number;
}

export interface AIRoutingOptimizationInput {
  organizationId: string;
  rules: AIRoutingRule[];
  observedFailures: Array<{
    workloadType: string;
    modelId: string;
    reason: "latency" | "cost" | "quality" | "safety" | "availability";
    count: number;
  }>;
}

export interface AIRoutingOptimizationResult {
  organizationId: string;
  optimizedRules: AIRoutingRule[];
  changes: string[];
  createdAt: Date;
}

export function optimizeAIRouting(
  input: AIRoutingOptimizationInput,
): AIRoutingOptimizationResult {
  const changes: string[] = [];

  const optimizedRules = input.rules.map((rule) => {
    const failures = input.observedFailures.filter(
      (failure) =>
        failure.workloadType === rule.workloadType &&
        failure.modelId === rule.preferredModelId,
    );

    const latencyFailures = failures
      .filter((failure) => failure.reason === "latency")
      .reduce((sum, failure) => sum + failure.count, 0);

    const costFailures = failures
      .filter((failure) => failure.reason === "cost")
      .reduce((sum, failure) => sum + failure.count, 0);

    if (latencyFailures > 5 && rule.fallbackModelId) {
      changes.push(`Enabled fallback routing for ${rule.workloadType} due to latency failures.`);
      return {
        ...rule,
        maxLatencyMs: Math.min(rule.maxLatencyMs ?? 3000, 2500),
      };
    }

    if (costFailures > 5) {
      changes.push(`Reduced cost threshold for ${rule.workloadType}.`);
      return {
        ...rule,
        maxCostUsd: Math.min(rule.maxCostUsd ?? 0.05, 0.03),
      };
    }

    return rule;
  });

  return {
    organizationId: input.organizationId,
    optimizedRules,
    changes,
    createdAt: new Date(),
  };
}