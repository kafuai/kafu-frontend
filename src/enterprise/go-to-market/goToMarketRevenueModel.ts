export type RevenueModelType =
  | "subscription"
  | "usage_based"
  | "hybrid"
  | "enterprise_contract";

export interface GoToMarketRevenueModel {
  id: string;
  type: RevenueModelType;
  description: string;
  expectedMonthlyRevenue: number;
  expectedAnnualRevenue: number;
}

export function createRevenueModel(
  model: GoToMarketRevenueModel,
): GoToMarketRevenueModel {
  return model;
}