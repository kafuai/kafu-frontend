import type {
  BillingAuditMetadata,
  BillingInterval,
  BillingSubscriptionStatus,
} from "./billingSubscriptionTypes";

export interface BillingSubscription extends BillingAuditMetadata {
  id: string;
  tenantId: string;
  planId: string;
  status: BillingSubscriptionStatus;
  interval: BillingInterval;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export const createBillingSubscription = (
  subscription: BillingSubscription
): BillingSubscription => subscription;

export const isSubscriptionActive = (
  subscription: BillingSubscription
): boolean =>
  subscription.status === "active" ||
  subscription.status === "trialing";

export const isSubscriptionCancelled = (
  subscription: BillingSubscription
): boolean =>
  subscription.status === "cancelled";
