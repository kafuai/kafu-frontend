export type CustomerExpansionOpportunityType =
  | "upsell"
  | "cross_sell"
  | "seat_expansion"
  | "module_expansion";

export interface CustomerExpansionOpportunity {
  accountId: string;
  type: CustomerExpansionOpportunityType;
  estimatedValue: number;
  confidence: number;
}

export function hasStrongExpansionSignal(
  opportunity: CustomerExpansionOpportunity,
): boolean {
  return opportunity.confidence >= 0.7;
}