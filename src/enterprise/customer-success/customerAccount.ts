import type { CustomerSuccessSummary } from "./customerSuccessTypes";

export interface CustomerAccount {
  id: string;
  companyId: string;
  name: string;
  industry?: string;
  summary: CustomerSuccessSummary;
}

export function createCustomerAccount(
  account: CustomerAccount,
): CustomerAccount {
  return account;
}