import type { CustomerHealth } from "./customerSuccessTypes";

export interface CustomerSuccessDashboard {
  totalAccounts: number;
  accountsByHealth: Record<CustomerHealth, number>;
  atRiskAccounts: number;
  upcomingRenewals: number;
}

export function createCustomerSuccessDashboard(
  dashboard: CustomerSuccessDashboard,
): CustomerSuccessDashboard {
  return dashboard;
}