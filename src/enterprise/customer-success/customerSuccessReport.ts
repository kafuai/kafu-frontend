import type { CustomerHealth } from "./customerSuccessTypes";

export interface CustomerSuccessReport {
  accountId: string;
  health: CustomerHealth;
  summary: string;
  risks: string[];
  opportunities: string[];
  generatedAt: Date;
}

export function generateCustomerSuccessReport(
  report: CustomerSuccessReport,
): CustomerSuccessReport {
  return report;
}