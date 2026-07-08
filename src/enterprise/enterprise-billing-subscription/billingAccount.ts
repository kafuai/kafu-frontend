import { BillingAccount } from "./billingSubscriptionTypes";

export function createBillingAccount(account: BillingAccount): BillingAccount {
  return {
    ...account,
    legalName: account.legalName.trim(),
    billingEmail: account.billingEmail.trim().toLowerCase(),
  };
}

export function updateBillingPaymentMethod(
  account: BillingAccount,
  paymentMethodId: string,
  updatedAt: string,
): BillingAccount {
  return {
    ...account,
    paymentMethodId,
    updatedAt,
  };
}

export function hasBillingPaymentMethod(account: BillingAccount): boolean {
  return Boolean(account.paymentMethodId);
}