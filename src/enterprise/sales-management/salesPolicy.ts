import { SalesPolicy } from "./salesManagementTypes";

export function createSalesPolicy(input: {
  id: string;
  name: string;
  description: string;
  minimumDealProbability?: number;
  defaultCommissionRate?: number;
  autoForecastEnabled?: boolean;
  status?: "active" | "inactive";
}): SalesPolicy {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    minimumDealProbability: clampScore(input.minimumDealProbability ?? 0.25),
    defaultCommissionRate: clampScore(input.defaultCommissionRate ?? 0.05),
    autoForecastEnabled: input.autoForecastEnabled ?? true,
    status: input.status ?? "active",
  };
}

export function isSalesPolicyActive(policy: SalesPolicy): boolean {
  return policy.status === "active";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}