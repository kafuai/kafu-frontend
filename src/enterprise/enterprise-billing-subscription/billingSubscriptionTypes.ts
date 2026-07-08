export type BillingPlanStatus = "draft" | "active" | "retired";

export type BillingInterval = "monthly" | "quarterly" | "yearly";

export type BillingSubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "cancelled"
  | "expired";

export type BillingInvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "overdue"
  | "void";

export type BillingPaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded";

export type BillingCurrency = "USD" | "EUR" | "GBP" | "SAR" | "AED" | "JOD";

export type BillingPlan = {
  id: string;
  name: string;
  status: BillingPlanStatus;
  currency: BillingCurrency;
  interval: BillingInterval;
  basePrice: number;
  includedUsageUnits: number;
  overageUnitPrice: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export type BillingAccount = {
  id: string;
  customerId: string;
  legalName: string;
  taxId?: string;
  currency: BillingCurrency;
  billingEmail: string;
  paymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingSubscription = {
  id: string;
  billingAccountId: string;
  planId: string;
  status: BillingSubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingInvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
};

export type BillingInvoice = {
  id: string;
  billingAccountId: string;
  subscriptionId: string;
  status: BillingInvoiceStatus;
  currency: BillingCurrency;
  subtotal: number;
  taxAmount: number;
  total: number;
  dueAt: string;
  paidAt?: string;
  lines: BillingInvoiceLine[];
  createdAt: string;
  updatedAt: string;
};

export type BillingPayment = {
  id: string;
  invoiceId: string;
  billingAccountId: string;
  status: BillingPaymentStatus;
  amount: number;
  currency: BillingCurrency;
  providerReference?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingUsageRecord = {
  id: string;
  subscriptionId: string;
  metricKey: string;
  quantity: number;
  recordedAt: string;
};

export type BillingEntitlement = {
  id: string;
  planId: string;
  featureKey: string;
  limit: number | "unlimited";
  enabled: boolean;
};

export type BillingRevenueSummary = {
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  activeSubscriptions: number;
  pastDueSubscriptions: number;
  churnedSubscriptions: number;
  currency: BillingCurrency;
};