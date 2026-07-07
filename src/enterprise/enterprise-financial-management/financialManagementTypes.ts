export type FinancialCurrency = "USD" | "EUR" | "GBP" | "SAR" | "AED" | "JOD";

export type FinancialStatus =
  | "draft"
  | "planned"
  | "active"
  | "completed"
  | "cancelled";

export type FinancialPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface FinancialAmount {
  value: number;
  currency: FinancialCurrency;
}

export interface FinancialOwner {
  id: string;
  name: string;
}

export interface FinancialPeriod {
  startDate: string;
  endDate: string;
}