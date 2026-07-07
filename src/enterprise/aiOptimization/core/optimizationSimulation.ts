import { OptimizationOpportunity } from "./optimizationOpportunity";

export interface OptimizationSimulationResult {
  opportunityId: string;
  predictedImprovement: number;
  predictedCostReduction: number;
  predictedLatencyReduction: number;
  successProbability: number;
  simulatedAt: Date;
}

export function simulateOptimization(
  opportunity: OptimizationOpportunity,
): OptimizationSimulationResult {
  const confidence = opportunity.confidence;

  return {
    opportunityId: opportunity.id,
    predictedImprovement: Math.round(confidence * 100),
    predictedCostReduction: Math.round(confidence * 30),
    predictedLatencyReduction: Math.round(confidence * 25),
    successProbability: confidence,
    simulatedAt: new Date(),
  };
}