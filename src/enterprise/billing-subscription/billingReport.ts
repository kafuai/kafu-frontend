import type { BillingInvoice } from "./billingInvoice";
import type { BillingPayment } from "./billingPayment";
import type { BillingSubscription } from "./billingSubscription";

export interface BillingReport {
  generatedAt: string;
  subscriptions: BillingSubscription[];
  invoices: BillingInvoice[];
  payments: BillingPayment[];
}

export const getTotalInvoices = (report: BillingReport): number =>
  report.invoices.length;

export const getTotalPayments = (report: BillingReport): number =>
  report.payments.length;

export const getActiveSubscriptions = (
  report: BillingReport
): BillingSubscription[] =>
  report.subscriptions.filter(
    (subscription) =>
      subscription.status === "active" ||
      subscription.status === "trialing"
  );
