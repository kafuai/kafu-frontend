import { EnterpriseAIProcess } from "./process.types";

export type EnterpriseAIProcessOptimizationSignal = {
  processId: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
};

export class EnterpriseAIProcessOptimizationAnalyzer {
  analyze(process: EnterpriseAIProcess): EnterpriseAIProcessOptimizationSignal[] {
    const signals: EnterpriseAIProcessOptimizationSignal[] = [];

    if (process.metrics.averageExecutionTimeMs > 300_000) {
      signals.push({
        processId: process.id,
        severity: "medium",
        recommendation: "Review long-running workflow steps and identify automation opportunities.",
      });
    }

    if (process.metrics.failureRate > 0.15) {
      signals.push({
        processId: process.id,
        severity: "high",
        recommendation: "Investigate recurring failure causes and add resilient recovery handling.",
      });
    }

    if (process.dependencies.length > 8) {
      signals.push({
        processId: process.id,
        severity: "low",
        recommendation: "Reduce dependency complexity or split the process into smaller process units.",
      });
    }

    return signals;
  }
}