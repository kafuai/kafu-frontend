export type PerformanceSeverity = "low" | "medium" | "high" | "critical";

export type PerformanceStatus = "healthy" | "degraded" | "critical";

export type PerformanceMetricType =
  | "latency"
  | "throughput"
  | "memory"
  | "cpu"
  | "cache"
  | "query"
  | "resource";

export type PerformanceMetric = {
  id: string;
  name: string;
  type: PerformanceMetricType;
  value: number;
  unit: string;
  recordedAt: Date;
};

export type PerformanceProfile = {
  id: string;
  organizationId: string;
  serviceName: string;
  status: PerformanceStatus;
  metrics: PerformanceMetric[];
  createdAt: Date;
  updatedAt: Date;
};

export type PerformanceBaseline = {
  id: string;
  organizationId: string;
  serviceName: string;
  metricType: PerformanceMetricType;
  expectedValue: number;
  tolerancePercentage: number;
  createdAt: Date;
  updatedAt: Date;
};