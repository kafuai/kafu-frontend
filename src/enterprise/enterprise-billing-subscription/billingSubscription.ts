import {
  BillingSubscription,
  BillingSubscriptionStatus,
} from "./billingSubscriptionTypes";

export function activateBillingSubscription(
  subscription: BillingSubscription,
  updatedAt: string,
): BillingSubscription {
  return {
    ...subscription,
    status: "active",
    updatedAt,
  };
}

export function pauseBillingSubscription(
  subscription: BillingSubscription,
  updatedAt: string,
): BillingSubscription {
  return {
    ...subscription,
    status: "paused",
    updatedAt,
  };
}

export function cancelBillingSubscription(
  subscription: BillingSubscription,
  updatedAt: string,
): BillingSubscription {
  return {
    ...subscription,
    status: "cancelled",
    cancelledAt: updatedAt,
    updatedAt,
  };
}

export function hasActiveBillingSubscription(
  subscription: BillingSubscription,
): boolean {
  return (
    subscription.status === "active" ||
    subscription.status === "trialing"
  );
}

export function updateBillingSubscriptionStatus(
  subscription: BillingSubscription,
  status: BillingSubscriptionStatus,
  updatedAt: string,
): BillingSubscription {
  return {
    ...subscription,
    status,
    updatedAt,
  };
}