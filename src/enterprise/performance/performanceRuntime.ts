import { PerformanceMetric } from "./performanceTypes";
import {
  PerformanceOptimizationEngineResult,
  runPerformanceOptimizationEngine,
} from "./performanceOptimizationEngine";
import { OptimizationRule } from "./optimizationRule";

export type PerformanceRuntimeInput = {
  metrics: PerformanceMetric[];
  threshold: number;
  rules: OptimizationRule[];
};

export function executePerformanceRuntime(
  input: PerformanceRuntimeInput,
): PerformanceOptimizationEngineResult {
  return runPerformanceOptimizationEngine(
    input.metrics,
    input.threshold,
    input.rules,
  );
}