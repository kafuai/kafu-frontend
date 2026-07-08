export type CommercialTier =
  | "starter"
  | "professional"
  | "enterprise";

export type CommercialStatus =
  | "draft"
  | "published"
  | "retired";

export interface PricingPlan {
  id: string;
  name: string;
  tier: CommercialTier;
  monthlyPrice: number;
}

export interface CommercialPackageModel {
  id: string;
  status: CommercialStatus;
  plans: PricingPlan[];
}
