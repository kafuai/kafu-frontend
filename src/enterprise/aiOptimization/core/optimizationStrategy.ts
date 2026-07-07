import { OptimizationOpportunity } from "./optimizationOpportunity";

export type OptimizationStrategyType =
  | "conservative"
  | "balanced"
  | "aggressive";

export interface OptimizationStrategy {
  id: string;
  name: string;
  type: OptimizationStrategyType;
  description: string;
  minimumConfidence: number;
  maximumRiskScore: number;
}

export function selectOptimizationStrategy(
  opportunity: OptimizationOpportunity,
): OptimizationStrategyType {
  if (opportunity.confidence >= 0.9) {
    return "aggressive";
  }

  if (opportunity.confidence >= 0.75) {
    return "balanced";
  }

  return "conservative";
}