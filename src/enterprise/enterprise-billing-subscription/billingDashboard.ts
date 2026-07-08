import {
  BillingInvoice,
  BillingSubscription,
} from "./billingSubscriptionTypes";
import { generateBillingRevenueSummary } from "./billingRevenueReport";

export type BillingDashboard = {
  activeSubscriptions: number;
  pastDueSubscriptions: number;
  paidInvoices: number;
  outstandingInvoices: number;
  revenue: ReturnType<typeof generateBillingRevenueSummary>;
};

export function buildBillingDashboard(
  subscriptions: BillingSubscription[],
  invoices: BillingInvoice[],
): BillingDashboard {
  return {
    activeSubscriptions: subscriptions.filter(
      (subscription) =>
        subscription.status === "active" ||
        subscription.status === "trialing",
    ).length,
    pastDueSubscriptions: subscriptions.filter(
      (subscription) => subscription.status === "past_due",
    ).length,
    paidInvoices: invoices.filter(
      (invoice) => invoice.status === "paid",
    ).length,
    outstandingInvoices: invoices.filter(
      (invoice) => invoice.status !== "paid",
    ).length,
    revenue: generateBillingRevenueSummary(invoices),
  };
}