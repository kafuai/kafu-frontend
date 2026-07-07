import {
  SalesQuote,
  SalesQuoteStatus,
} from "./salesManagementTypes";

export function createSalesQuote(input: {
  id: string;
  dealId: string;
  quoteNumber: string;
  status?: SalesQuoteStatus;
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  validUntil?: string;
  createdAt?: string;
  updatedAt?: string;
}): SalesQuote {
  const now = new Date().toISOString();
  const subtotal = Math.max(0, input.subtotal ?? 0);
  const discountAmount = Math.max(0, input.discountAmount ?? 0);
  const taxAmount = Math.max(0, input.taxAmount ?? 0);

  return {
    id: input.id,
    dealId: input.dealId,
    quoteNumber: input.quoteNumber,
    status: input.status ?? "draft",
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount: Math.max(0, subtotal - discountAmount + taxAmount),
    validUntil: input.validUntil,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isSalesQuoteAccepted(quote: SalesQuote): boolean {
  return quote.status === "accepted";
}