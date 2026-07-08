import type {
  BillingAuditMetadata,
  BillingInvoiceStatus,
  BillingMoney,
} from "./billingSubscriptionTypes";

export interface BillingInvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: BillingMoney;
  total: BillingMoney;
}

export interface BillingInvoice extends BillingAuditMetadata {
  id: string;
  tenantId: string;
  subscriptionId: string;
  invoiceNumber: string;
  status: BillingInvoiceStatus;
  subtotal: BillingMoney;
  tax?: BillingMoney;
  total: BillingMoney;
  lines: BillingInvoiceLine[];
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
}

export const createBillingInvoice = (
  invoice: BillingInvoice
): BillingInvoice => invoice;

export const isInvoicePaid = (invoice: BillingInvoice): boolean =>
  invoice.status === "paid";

export const getInvoiceLineCount = (invoice: BillingInvoice): number =>
  invoice.lines.length;
