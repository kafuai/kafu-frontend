export interface ExecutiveRevenueDashboard {
  workspaceId: string;
  generatedAt: Date;

  summary: ExecutiveRevenueSummary;
  forecast: ExecutiveForecast;

  pipelineHealth: PipelineHealthSnapshot;

  executiveScore: ExecutiveScore;

  alerts: ExecutiveAlert[];

  insights: ExecutiveInsight[];

  widgets: ExecutiveRevenueWidget[];
}

export interface ExecutiveRevenueSummary {
  totalRevenue: number;
  committedRevenue: number;
  weightedRevenue: number;
  predictedRevenue: number;
  activeOpportunities: number;
  winRate: number;
  averageDealSize: number;
}

export interface PipelineHealthSnapshot {
  score: number;
  trend: "up" | "down" | "stable";
  coverage: number;
  healthyOpportunities: number;
  riskyOpportunities: number;
  stalledOpportunities: number;
}

export interface ExecutiveScore {
  score: number;
  confidence: number;
  generatedAt: Date;
}

import type { ExecutiveForecast } from "./ExecutiveForecast";
import type { ExecutiveAlert } from "./ExecutiveAlert";
import type { ExecutiveInsight } from "./ExecutiveInsight";
import type { ExecutiveRevenueWidget } from "./ExecutiveRevenueWidget";