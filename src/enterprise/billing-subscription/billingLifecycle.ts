import type { BillingSubscription } from "./billingSubscription";

export interface BillingLifecycleEvent {
  id: string;
  tenantId: string;
  subscriptionId: string;
  fromStatus?: BillingSubscription["status"];
  toStatus: BillingSubscription["status"];
  reason?: string;
  occurredAt: string;
}

export const createBillingLifecycleEvent = (
  event: BillingLifecycleEvent
): BillingLifecycleEvent => event;

export const isCancellationEvent = (event: BillingLifecycleEvent): boolean =>
  event.toStatus === "cancelled";

export const isActivationEvent = (event: BillingLifecycleEvent): boolean =>
  event.toStatus === "active";
