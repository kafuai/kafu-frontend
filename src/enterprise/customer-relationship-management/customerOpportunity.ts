import {
  CustomerOpportunity,
  CustomerRelationshipOpportunityStage,
} from "./customerRelationshipManagementTypes";

export function createCustomerOpportunity(input: {
  id: string;
  accountId: string;
  title: string;
  stage?: CustomerRelationshipOpportunityStage;
  estimatedValue?: number;
  probability?: number;
  expectedCloseDate?: string;
  createdAt?: string;
  updatedAt?: string;
}): CustomerOpportunity {
  const now = new Date().toISOString();

  return {
    id: input.id,
    accountId: input.accountId,
    title: input.title,
    stage: input.stage ?? "identified",
    estimatedValue: Math.max(0, input.estimatedValue ?? 0),
    probability: clampScore(input.probability ?? 0.25),
    expectedCloseDate: input.expectedCloseDate,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function calculateCustomerOpportunityWeightedValue(
  opportunity: CustomerOpportunity,
): number {
  return opportunity.estimatedValue * opportunity.probability;
}

export function isCustomerOpportunityOpen(
  opportunity: CustomerOpportunity,
): boolean {
  return !["won", "lost"].includes(opportunity.stage);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}