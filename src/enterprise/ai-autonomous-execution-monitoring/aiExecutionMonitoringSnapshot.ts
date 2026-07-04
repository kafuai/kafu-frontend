import {
  AIExecutionMonitoringContext,
  AIExecutionMonitoringMetric,
  AIExecutionMonitoringStatus,
  AIExecutionMonitoringTrend,
} from "./aiAutonomousExecutionMonitoringTypes";
import {
  AIExecutionMonitoringSignal,
  isCriticalAIExecutionMonitoringSignal,
} from "./aiExecutionMonitoringSignal";

export interface AIExecutionMonitoringSnapshot {
  id: string;
  context: AIExecutionMonitoringContext;
  status: AIExecutionMonitoringStatus;
  trend: AIExecutionMonitoringTrend;
  progress: number;
  metrics: AIExecutionMonitoringMetric[];
  signals: AIExecutionMonitoringSignal[];
  summary: string;
  createdAt: Date;
}

export interface CreateAIExecutionMonitoringSnapshotInput {
  context: AIExecutionMonitoringContext;
  progress: number;
  metrics?: AIExecutionMonitoringMetric[];
  signals?: AIExecutionMonitoringSignal[];
  summary?: string;
  createdAt?: Date;
}

function clampProgress(progress: number): number {
  return Math.max(0, Math.min(100, progress));
}

function resolveMonitoringStatus(
  progress: number,
  signals: AIExecutionMonitoringSignal[],
): AIExecutionMonitoringStatus {
  if (signals.some(isCriticalAIExecutionMonitoringSignal)) {
    return "blocked";
  }

  if (signals.some((signal) => signal.severity === "warning")) {
    return "watch";
  }

  if (progress >= 100) {
    return "healthy";
  }

  return "healthy";
}

function resolveMonitoringTrend(
  metrics: AIExecutionMonitoringMetric[],
): AIExecutionMonitoringTrend {
  const weightedMetrics = metrics.filter(
    (metric) => typeof metric.target === "number" && metric.target > 0,
  );

  if (weightedMetrics.length === 0) {
    return "stable";
  }

  const averageRatio =
    weightedMetrics.reduce((total, metric) => {
      const weight = metric.weight ?? 1;
      return total + (metric.value / Number(metric.target)) * weight;
    }, 0) /
    weightedMetrics.reduce((total, metric) => total + (metric.weight ?? 1), 0);

  if (averageRatio >= 1.05) {
    return "improving";
  }

  if (averageRatio < 0.8) {
    return "declining";
  }

  return "stable";
}

export function createAIExecutionMonitoringSnapshot(
  input: CreateAIExecutionMonitoringSnapshotInput,
): AIExecutionMonitoringSnapshot {
  const progress = clampProgress(input.progress);
  const signals = input.signals ?? [];
  const metrics = input.metrics ?? [];
  const createdAt = input.createdAt ?? new Date();

  return {
    id: `${input.context.executionId}-monitoring-${createdAt.getTime()}`,
    context: input.context,
    status: resolveMonitoringStatus(progress, signals),
    trend: resolveMonitoringTrend(metrics),
    progress,
    metrics,
    signals,
    summary:
      input.summary ??
      `Execution ${input.context.executionId} monitored at ${progress}% progress.`,
    createdAt,
  };
}

export function hasBlockingAIExecutionMonitoringSnapshot(
  snapshot: AIExecutionMonitoringSnapshot,
): boolean {
  return snapshot.status === "blocked" || snapshot.status === "failed";
}