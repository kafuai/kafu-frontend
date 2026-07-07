export type ProcurementStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "ordered"
  | "received"
  | "closed";

export type ProcurementPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ProcurementAmount {
  value: number;
  currency: "USD" | "EUR" | "GBP" | "SAR" | "AED" | "JOD";
}

export interface ProcurementOwner {
  id: string;
  name: string;
}

export interface ProcurementPeriod {
  startDate: string;
  endDate: string;
}