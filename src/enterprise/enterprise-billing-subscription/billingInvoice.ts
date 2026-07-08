import {
  BillingInvoice,
  BillingInvoiceStatus,
} from "./billingSubscriptionTypes";

export function issueBillingInvoice(
  invoice: BillingInvoice,
  updatedAt: string,
): BillingInvoice {
  return {
    ...invoice,
    status: "issued",
    updatedAt,
  };
}

export function markBillingInvoicePaid(
  invoice: BillingInvoice,
  paidAt: string,
): BillingInvoice {
  return {
    ...invoice,
    status: "paid",
    paidAt,
    updatedAt: paidAt,
  };
}

export function markBillingInvoiceOverdue(
  invoice: BillingInvoice,
  updatedAt: string,
): BillingInvoice {
  return {
    ...invoice,
    status: "overdue",
    updatedAt,
  };
}

export function updateBillingInvoiceStatus(
  invoice: BillingInvoice,
  status: BillingInvoiceStatus,
  updatedAt: string,
): BillingInvoice {
  return {
    ...invoice,
    status,
    updatedAt,
  };
}

export function calculateInvoiceOutstandingAmount(
  invoice: BillingInvoice,
): number {
  return invoice.status === "paid" ? 0 : invoice.total;
}