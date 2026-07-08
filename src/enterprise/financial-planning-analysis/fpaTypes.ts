export type FPAStatus =
  | "draft"
  | "active"
  | "under_review"
  | "approved"
  | "locked"
  | "archived";

export type FPAPeriod =
  | "monthly"
  | "quarterly"
  | "semi_annual"
  | "annual";

export type FPACurrency = "USD" | "JOD" | "SAR" | "AED" | "EUR";

export type FPAMetricDirection = "increase" | "decrease" | "stable";

export interface FPABaseline {
  id: string;
  name: string;
  fiscalYear: number;
  period: FPAPeriod;
  currency: FPACurrency;
  status: FPAStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface FPAAmount {
  value: number;
  currency: FPACurrency;
}

export interface FPAAuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface FPASummary {
  baselineId: string;
  totalRevenue: FPAAmount;
  totalCost: FPAAmount;
  operatingMargin: number;
  varianceRate: number;
  status: FPAStatus;
}
