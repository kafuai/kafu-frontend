import {
  SalesDeal,
  SalesDealStage,
  SalesManagementPriority,
} from "./salesManagementTypes";

export function createSalesDeal(input: {
  id: string;
  pipelineId: string;
  accountId: string;
  title: string;
  stage?: SalesDealStage;
  estimatedValue?: number;
  probability?: number;
  priority?: SalesManagementPriority;
  expectedCloseDate?: string;
  createdAt?: string;
  updatedAt?: string;
}): SalesDeal {
  const now = new Date().toISOString();

  return {
    id: input.id,
    pipelineId: input.pipelineId,
    accountId: input.accountId,
    title: input.title,
    stage: input.stage ?? "identified",
    estimatedValue: Math.max(0, input.estimatedValue ?? 0),
    probability: clampScore(input.probability ?? 0.25),
    priority: input.priority ?? "medium",
    expectedCloseDate: input.expectedCloseDate,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function calculateSalesDealWeightedValue(deal: SalesDeal): number {
  return deal.estimatedValue * deal.probability;
}

export function isSalesDealOpen(deal: SalesDeal): boolean {
  return !["closed_won", "closed_lost"].includes(deal.stage);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}