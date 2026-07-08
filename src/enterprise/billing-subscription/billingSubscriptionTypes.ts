export type BillingCurrency = "USD" | "JOD" | "EUR" | "GBP";

export type BillingInterval = "monthly" | "quarterly" | "yearly";

export type BillingPlanTier = "starter" | "professional" | "business" | "enterprise";

export type BillingSubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "cancelled"
  | "expired";

export type BillingInvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "void"
  | "uncollectible";

export type BillingPaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

export interface BillingMoney {
  amount: number;
  currency: BillingCurrency;
}

export interface BillingFeatureLimit {
  featureKey: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

export interface BillingAuditMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
