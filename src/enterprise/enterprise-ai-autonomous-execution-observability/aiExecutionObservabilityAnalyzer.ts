import {
  AIExecutionObservabilityMetric,
  AIExecutionObservabilitySignal,
} from "./aiAutonomousExecutionObservabilityTypes";
import { createAIExecutionObservabilitySignal } from "./aiExecutionObservabilitySignal";

export interface AIExecutionObservabilityAnalysisResult {
  generatedSignals: AIExecutionObservabilitySignal[];
  averageMetricValue: number;
  maxMetricValue: number;
  metricCount: number;
}

export function analyzeAIExecutionObservabilityMetrics(
  metrics: AIExecutionObservabilityMetric[],
): AIExecutionObservabilityAnalysisResult {
  if (metrics.length === 0) {
    return {
      generatedSignals: [],
      averageMetricValue: 0,
      maxMetricValue: 0,
      metricCount: 0,
    };
  }

  const values = metrics.map((metric) => metric.value);
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = total / values.length;
  const max = Math.max(...values);

  const generatedSignals: AIExecutionObservabilitySignal[] = [];

  if (max > average * 2 && max > 0) {
    generatedSignals.push(
      createAIExecutionObservabilitySignal({
        type: "execution_metric",
        source: "execution_runtime",
        severity: "warning",
        title: "Metric spike detected",
        description:
          "A metric value exceeded twice the observed average, indicating possible execution instability.",
        confidence: 0.78,
        metadata: {
          averageMetricValue: average,
          maxMetricValue: max,
        },
      }),
    );
  }

  return {
    generatedSignals,
    averageMetricValue: average,
    maxMetricValue: max,
    metricCount: metrics.length,
  };
}