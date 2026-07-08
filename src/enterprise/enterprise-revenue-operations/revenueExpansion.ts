export interface RevenueExpansionOpportunity {
  id: string;
  accountId: string;
  expansionValue: number;
  probability: number;
}

export function expectedExpansionRevenue(
  opportunity: RevenueExpansionOpportunity,
): number {
  return opportunity.expansionValue * opportunity.probability;
}
