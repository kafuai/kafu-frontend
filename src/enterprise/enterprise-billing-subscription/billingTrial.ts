import { BillingSubscription } from "./billingSubscriptionTypes";

export function isBillingTrialActive(
  subscription: BillingSubscription,
  now: string,
): boolean {
  return (
    subscription.status === "trialing" &&
    Boolean(subscription.trialEndsAt) &&
    new Date(subscription.trialEndsAt as string).getTime() > new Date(now).getTime()
  );
}

export function endBillingTrial(
  subscription: BillingSubscription,
  updatedAt: string,
): BillingSubscription {
  return {
    ...subscription,
    status: "active",
    trialEndsAt: undefined,
    updatedAt,
  };
}