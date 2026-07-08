import {
  BillingRevenueSummary,
  BillingInvoice,
} from "./billingSubscriptionTypes";

export function generateBillingRevenueSummary(
  invoices: BillingInvoice[],
): BillingRevenueSummary {
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "paid",
  );

  const revenue = paidInvoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0,
  );

  return {
    monthlyRecurringRevenue: revenue,
    annualRecurringRevenue: revenue * 12,
    activeSubscriptions: 0,
    pastDueSubscriptions: 0,
    churnedSubscriptions: 0,
    currency: paidInvoices[0]?.currency ?? "USD",
  };
}