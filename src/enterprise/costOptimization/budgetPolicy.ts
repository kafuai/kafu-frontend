import { CostCurrency, CostPeriod } from "./costTypes";

export type BudgetPolicy = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  period: CostPeriod;
  currency: CostCurrency;
  limit: number;
  warningThreshold: number;
  criticalThreshold: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBudgetPolicyInput = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  period?: CostPeriod;
  currency?: CostCurrency;
  limit: number;
  warningThreshold?: number;
  criticalThreshold?: number;
};

export function createBudgetPolicy(
  input: CreateBudgetPolicyInput,
): BudgetPolicy {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    period: input.period ?? "monthly",
    currency: input.currency ?? "USD",
    limit: input.limit,
    warningThreshold: input.warningThreshold ?? 0.8,
    criticalThreshold: input.criticalThreshold ?? 0.95,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  };
}