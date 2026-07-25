export type ExecutiveHealthStatus =
  | "healthy"
  | "attention"
  | "critical";

export type ExecutiveTrendDirection =
  | "up"
  | "down"
  | "neutral";

export type ExecutiveKpiCategory =
  | "revenue"
  | "sales"
  | "execution"
  | "customer"
  | "organization";

export type ExecutiveKpiUnit =
  | "currency"
  | "percentage"
  | "ratio"
  | "count"
  | "score"
  | "currency_per_day";

export type ExecutiveKpiPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ExecutiveKpi {
  id: string;
  category: ExecutiveKpiCategory;
  label: string;
  description: string;
  value: number;
  formattedValue: string;
  unit: ExecutiveKpiUnit;
  target?: number;
  targetFormattedValue?: string;
  attainment?: number;
  trend: ExecutiveTrendDirection;
  status: ExecutiveHealthStatus;
  priority: ExecutiveKpiPriority;
  source: string;
  generatedAt: string;
}

export interface ExecutiveHealthDimension {
  id: string;
  label: string;
  score: number;
  weight: number;
  weightedScore: number;
  status: ExecutiveHealthStatus;
  explanation: string;
}

export interface OrganizationHealth {
  score: number;
  status: ExecutiveHealthStatus;
  dimensions: ExecutiveHealthDimension[];
  criticalDimensions: number;
  attentionDimensions: number;
  generatedAt: string;
}

export interface ExecutiveSummary {
  headline: string;
  overview: string;
  strengths: string[];
  concerns: string[];
  recommendedFocus: string[];
}

export interface ExecutiveKpiSnapshot {
  generatedAt: string;
  currency: string;
  health: OrganizationHealth;
  kpis: ExecutiveKpi[];
  summary: ExecutiveSummary;
}