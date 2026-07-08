import type {
  BillingAuditMetadata,
  BillingMoney,
  BillingPaymentStatus,
} from "./billingSubscriptionTypes";

export interface BillingPayment extends BillingAuditMetadata {
  id: string;
  tenantId: string;
  invoiceId: string;
  amount: BillingMoney;
  status: BillingPaymentStatus;
  provider: string;
  providerPaymentId?: string;
  attemptedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export const createBillingPayment = (
  payment: BillingPayment
): BillingPayment => payment;

export const isPaymentSuccessful = (payment: BillingPayment): boolean =>
  payment.status === "succeeded";

export const isPaymentFailed = (payment: BillingPayment): boolean =>
  payment.status === "failed";
