import type { OperationalPerformanceMetric } from "./operationalPerformanceTypes";
import { operationalPerformanceMetrics } from "./operationalMetrics";
import { benchmarkOperationalPortfolio } from "./operationalBenchmark";
import { buildOperationalPerformanceDashboard } from "./operationalDashboard";

export function runOperationalPerformanceIntelligence(
  metrics: OperationalPerformanceMetric[] = operationalPerformanceMetrics
) {
  return {
    benchmarks: benchmarkOperationalPortfolio(metrics),
    dashboard: buildOperationalPerformanceDashboard(metrics),
  };
}
