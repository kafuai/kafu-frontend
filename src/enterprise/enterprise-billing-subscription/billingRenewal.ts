import { BillingSubscription } from "./billingSubscriptionTypes";

export function renewBillingSubscriptionPeriod(
  subscription: BillingSubscription,
  nextPeriodStart: string,
  nextPeriodEnd: string,
  updatedAt: string,
): BillingSubscription {
  return {
    ...subscription,
    currentPeriodStart: nextPeriodStart,
    currentPeriodEnd: nextPeriodEnd,
    updatedAt,
  };
}

export function isBillingSubscriptionRenewable(
  subscription: BillingSubscription,
): boolean {
  return subscription.status === "active" || subscription.status === "trialing";
}