import type {
  ExecutiveHealthStatus,
  ExecutiveKpiCategory,
  ExecutiveKpiPriority,
} from "./executiveKpiTypes";

export type ExecutiveAlertType =
  | "strategic"
  | "revenue"
  | "sales"
  | "operational";

export type ExecutiveAlertStatus =
  | "open"
  | "acknowledged"
  | "resolved"
  | "dismissed";

export type ExecutiveAlertActionType =
  | "review"
  | "investigate"
  | "assign"
  | "contact"
  | "escalate";

export interface ExecutiveAlertAction {
  type: ExecutiveAlertActionType;
  label: string;
  description: string;
}

export interface ExecutiveAlert {
  id: string;
  type: ExecutiveAlertType;
  category: ExecutiveKpiCategory;
  title: string;
  description: string;
  priority: ExecutiveKpiPriority;
  healthStatus: ExecutiveHealthStatus;
  status: ExecutiveAlertStatus;
  sourceKpiId: string;
  source: string;
  score: number;
  impact: string;
  recommendedAction: ExecutiveAlertAction;
  generatedAt: string;
}

export interface ExecutiveAlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  strategic: number;
  revenue: number;
  sales: number;
  operational: number;
}

export interface ExecutiveAlertSnapshot {
  generatedAt: string;
  alerts: ExecutiveAlert[];
  summary: ExecutiveAlertSummary;
}