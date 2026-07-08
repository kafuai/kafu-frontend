import type {
  RevenueMotion,
  RevenueOperationStatus,
  RevenueOwner,
  RevenuePriority,
} from "./revenueOperationsTypes";

export interface RevenuePipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
}

export interface RevenuePipelineOpportunity {
  id: string;
  accountName: string;
  motion: RevenueMotion;
  stageId: string;
  owner: RevenueOwner;
  amount: number;
  currency: string;
  priority: RevenuePriority;
  status: RevenueOperationStatus;
  expectedCloseDate: string;
}

export function calculatePipelineValue(
  opportunities: RevenuePipelineOpportunity[],
): number {
  return opportunities.reduce((total, opportunity) => total + opportunity.amount, 0);
}

export function calculateWeightedPipeline(
  opportunities: RevenuePipelineOpportunity[],
  stages: RevenuePipelineStage[],
): number {
  const probabilities = new Map(stages.map((stage) => [stage.id, stage.probability]));

  return opportunities.reduce((total, opportunity) => {
    const probability = probabilities.get(opportunity.stageId) ?? 0;
    return total + opportunity.amount * probability;
  }, 0);
}
