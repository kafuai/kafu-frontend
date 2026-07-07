import {
  SalesOrder,
  SalesOrderStatus,
  SalesQuote,
} from "./salesManagementTypes";

export function createSalesOrder(input: {
  id: string;
  quoteId: string;
  accountId: string;
  orderNumber: string;
  status?: SalesOrderStatus;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}): SalesOrder {
  const now = new Date().toISOString();

  return {
    id: input.id,
    quoteId: input.quoteId,
    accountId: input.accountId,
    orderNumber: input.orderNumber,
    status: input.status ?? "created",
    totalAmount: Math.max(0, input.totalAmount ?? 0),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function createSalesOrderFromAcceptedQuote(input: {
  id: string;
  accountId: string;
  orderNumber: string;
  quote: SalesQuote;
  createdAt?: string;
  updatedAt?: string;
}): SalesOrder {
  const now = new Date().toISOString();

  return {
    id: input.id,
    quoteId: input.quote.id,
    accountId: input.accountId,
    orderNumber: input.orderNumber,
    status: "created",
    totalAmount: input.quote.totalAmount,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isSalesOrderOpen(order: SalesOrder): boolean {
  return !["fulfilled", "invoiced", "cancelled"].includes(order.status);
}