import {
  BillingInvoice,
  BillingSubscription,
} from "./billingSubscriptionTypes";
import { buildBillingDashboard } from "./billingDashboard";

export type BillingSubscriptionEngineResult = {
  dashboard: ReturnType<typeof buildBillingDashboard>;
  invoicesProcessed: number;
  subscriptionsProcessed: number;
};

export function executeBillingSubscriptionEngine(
  subscriptions: BillingSubscription[],
  invoices: BillingInvoice[],
): BillingSubscriptionEngineResult {
  return {
    dashboard: buildBillingDashboard(
      subscriptions,
      invoices,
    ),
    invoicesProcessed: invoices.length,
    subscriptionsProcessed: subscriptions.length,
  };
}