export type ReportingMetricAggregation = "sum" | "avg" | "min" | "max" | "count";

export interface ReportingMetric {
  id: string;
  name: string;
  description?: string;
  field: string;
  aggregation: ReportingMetricAggregation;
  unit?: string;
}

export function calculateReportingMetricValue(values: number[], aggregation: ReportingMetricAggregation): number {
  if (values.length === 0) return 0;

  switch (aggregation) {
    case "sum":
      return values.reduce((total, value) => total + value, 0);
    case "avg":
      return values.reduce((total, value) => total + value, 0) / values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    case "count":
      return values.length;
  }
}
