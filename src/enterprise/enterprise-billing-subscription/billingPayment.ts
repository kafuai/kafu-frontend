import {
  BillingPayment,
  BillingPaymentStatus,
} from "./billingSubscriptionTypes";

export function completeBillingPayment(
  payment: BillingPayment,
  providerReference: string,
  updatedAt: string,
): BillingPayment {
  return {
    ...payment,
    status: "succeeded",
    providerReference,
    updatedAt,
  };
}

export function failBillingPayment(
  payment: BillingPayment,
  reason: string,
  updatedAt: string,
): BillingPayment {
  return {
    ...payment,
    status: "failed",
    failureReason: reason,
    updatedAt,
  };
}

export function refundBillingPayment(
  payment: BillingPayment,
  updatedAt: string,
): BillingPayment {
  return {
    ...payment,
    status: "refunded",
    updatedAt,
  };
}

export function updateBillingPaymentStatus(
  payment: BillingPayment,
  status: BillingPaymentStatus,
  updatedAt: string,
): BillingPayment {
  return {
    ...payment,
    status,
    updatedAt,
  };
}