export type {
  AnalyticsSeverity,
  AnalyticsTrend,
  AnalyticsSignalType,
  ExecutionAnalyticsMetric,
  ExecutionAnalyticsSignal,
  ExecutionAnalyticsInsight,
  ExecutionAnalyticsReport,
  ExecutionAnalyticsInput,
} from "./analyticsTypes";

export {
  calculateAnalyticsDelta,
  classifyAnalyticsSeverity,
  classifyAnalyticsTrend,
  calculateSignalConfidence,
  calculateHealthScore,
  calculateRiskScore,
} from "./analyticsScoring";

export { detectExecutionAnalyticsSignals } from "./analyticsSignalDetector";

export { generateExecutionAnalyticsInsights } from "./analyticsInsightEngine";

export { buildExecutionAnalyticsReport } from "./analyticsReportBuilder";

export type { ExecutionAnalyticsAggregate } from "./analyticsAggregator";

export { aggregateExecutionAnalyticsMetrics } from "./analyticsAggregator";