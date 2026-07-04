export type AnalyticsSeverity = "low" | "medium" | "high" | "critical";

export type AnalyticsTrend = "improving" | "stable" | "degrading" | "volatile";

export type AnalyticsSignalType =
  | "performance"
  | "reliability"
  | "risk"
  | "cost"
  | "quality"
  | "throughput"
  | "latency"
  | "compliance"
  | "governance";

export interface ExecutionAnalyticsMetric {
  id: string;
  name: string;
  type: AnalyticsSignalType;
  value: number;
  baseline: number;
  unit: string;
  timestamp: string;
  source: string;
}

export interface ExecutionAnalyticsSignal {
  id: string;
  metricId: string;
  type: AnalyticsSignalType;
  severity: AnalyticsSeverity;
  trend: AnalyticsTrend;
  delta: number;
  confidence: number;
  summary: string;
  detectedAt: string;
}

export interface ExecutionAnalyticsInsight {
  id: string;
  signalId: string;
  title: string;
  description: string;
  severity: AnalyticsSeverity;
  recommendedAction: string;
  confidence: number;
  createdAt: string;
}

export interface ExecutionAnalyticsReport {
  id: string;
  generatedAt: string;
  metrics: ExecutionAnalyticsMetric[];
  signals: ExecutionAnalyticsSignal[];
  insights: ExecutionAnalyticsInsight[];
  healthScore: number;
  riskScore: number;
  summary: string;
}

export interface ExecutionAnalyticsInput {
  metrics: ExecutionAnalyticsMetric[];
  generatedAt?: string;
}