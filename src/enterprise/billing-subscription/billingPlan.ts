import type {
  BillingAuditMetadata,
  BillingFeatureLimit,
  BillingInterval,
  BillingMoney,
  BillingPlanTier,
} from "./billingSubscriptionTypes";

export interface BillingPlan extends BillingAuditMetadata {
  id: string;
  name: string;
  tier: BillingPlanTier;
  description: string;
  price: BillingMoney;
  interval: BillingInterval;
  features: BillingFeatureLimit[];
  isPublic: boolean;
  isActive: boolean;
}

export const createBillingPlan = (plan: BillingPlan): BillingPlan => plan;

export const isEnterprisePlan = (plan: BillingPlan): boolean =>
  plan.tier === "enterprise";

export const getPlanFeatureLimit = (
  plan: BillingPlan,
  featureKey: string
): BillingFeatureLimit | undefined =>
  plan.features.find((feature) => feature.featureKey === featureKey);
