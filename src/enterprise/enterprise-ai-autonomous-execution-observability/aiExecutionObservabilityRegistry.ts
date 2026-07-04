import {
  AIExecutionObservabilityMetric,
  AIExecutionObservabilitySignal,
  AIExecutionObservabilityTrace,
} from "./aiAutonomousExecutionObservabilityTypes";

export class AIExecutionObservabilityRegistry {
  private readonly signals: AIExecutionObservabilitySignal[] = [];

  private readonly metrics: AIExecutionObservabilityMetric[] = [];

  private readonly traces: AIExecutionObservabilityTrace[] = [];

  addSignal(signal: AIExecutionObservabilitySignal): void {
    this.signals.push(signal);
  }

  addMetric(metric: AIExecutionObservabilityMetric): void {
    this.metrics.push(metric);
  }

  addTrace(trace: AIExecutionObservabilityTrace): void {
    this.traces.push(trace);
  }

  getSignals(): readonly AIExecutionObservabilitySignal[] {
    return this.signals;
  }

  getMetrics(): readonly AIExecutionObservabilityMetric[] {
    return this.metrics;
  }

  getTraces(): readonly AIExecutionObservabilityTrace[] {
    return this.traces;
  }

  clear(): void {
    this.signals.length = 0;
    this.metrics.length = 0;
    this.traces.length = 0;
  }
}