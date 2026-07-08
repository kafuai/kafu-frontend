import type {
  RevenueMotion,
  RevenueOwner,
  RevenuePriority,
} from "./revenueOperationsTypes";

export interface RevenueAccountPlan {
  id: string;
  accountId: string;
  accountName: string;
  motion: RevenueMotion;
  owner: RevenueOwner;
  strategicObjectives: string[];
  growthOpportunities: string[];
  risks: string[];
  priority: RevenuePriority;
  updatedAt: string;
}

export function summarizeAccountPlan(plan: RevenueAccountPlan): string {
  return `${plan.accountName} • ${plan.motion} • ${plan.priority}`;
}
