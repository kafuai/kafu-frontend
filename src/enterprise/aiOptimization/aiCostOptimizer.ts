export interface AICostWorkload {
  id: string;
  name: string;
  monthlyExecutions: number;
  averageCostUsd: number;
  cacheable: boolean;
  canUseSmallerModel: boolean;
  canBatch: boolean;
}

export interface AICostOptimizationResult {
  organizationId: string;
  recommendations: Array<{
    workloadId: string;
    action: "enable_cache" | "use_smaller_model" | "batch_requests";
    estimatedMonthlySavingsUsd: number;
    reason: string;
  }>;
  totalEstimatedMonthlySavingsUsd: number;
  createdAt: Date;
}

export function optimizeAICosts(
  organizationId: string,
  workloads: AICostWorkload[],
): AICostOptimizationResult {
  const recommendations: AICostOptimizationResult["recommendations"] = [];

  for (const workload of workloads) {
    const monthlyCost = workload.monthlyExecutions * workload.averageCostUsd;

    if (workload.cacheable && monthlyCost > 100) {
      recommendations.push({
        workloadId: workload.id,
        action: "enable_cache",
        estimatedMonthlySavingsUsd: monthlyCost * 0.25,
        reason: "High monthly repeated workload cost detected.",
      });
    }

    if (workload.canUseSmallerModel && monthlyCost > 50) {
      recommendations.push({
        workloadId: workload.id,
        action: "use_smaller_model",
        estimatedMonthlySavingsUsd: monthlyCost * 0.18,
        reason: "Workload can be handled by a smaller model tier.",
      });
    }

    if (workload.canBatch && workload.monthlyExecutions > 10000) {
      recommendations.push({
        workloadId: workload.id,
        action: "batch_requests",
        estimatedMonthlySavingsUsd: monthlyCost * 0.12,
        reason: "High-volume workload can benefit from batching.",
      });
    }
  }

  return {
    organizationId,
    recommendations,
    totalEstimatedMonthlySavingsUsd: recommendations.reduce(
      (sum, recommendation) => sum + recommendation.estimatedMonthlySavingsUsd,
      0,
    ),
    createdAt: new Date(),
  };
}