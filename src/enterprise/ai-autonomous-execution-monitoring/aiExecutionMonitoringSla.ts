import {
  AIExecutionMonitoringSeverity,
  AIExecutionMonitoringSlaStatus,
} from "./aiAutonomousExecutionMonitoringTypes";
import {
  AIExecutionMonitoringSignal,
  createAIExecutionMonitoringSignal,
} from "./aiExecutionMonitoringSignal";
import { AIExecutionMonitoringSnapshot } from "./aiExecutionMonitoringSnapshot";

export interface AIExecutionMonitoringSlaPolicy {
  id: string;
  name: string;
  maxDurationMs: number;
  warningThresholdRatio?: number;
  requiredProgress?: number;
}

export interface AIExecutionMonitoringSlaAssessment {
  executionId: string;
  policyId: string;
  status: AIExecutionMonitoringSlaStatus;
  elapsedMs: number;
  expectedProgress?: number;
  severity: AIExecutionMonitoringSeverity;
  signals: AIExecutionMonitoringSignal[];
  assessedAt: Date;
}

export interface AssessAIExecutionMonitoringSlaInput {
  snapshot: AIExecutionMonitoringSnapshot;
  policy: AIExecutionMonitoringSlaPolicy;
  source?: string;
}

function resolveSlaStatus(
  elapsedMs: number,
  progress: number,
  policy: AIExecutionMonitoringSlaPolicy,
): AIExecutionMonitoringSlaStatus {
  const warningRatio = policy.warningThresholdRatio ?? 0.8;

  if (elapsedMs > policy.maxDurationMs) {
    return "breached";
  }

  if (
    elapsedMs >= policy.maxDurationMs * warningRatio &&
    typeof policy.requiredProgress === "number" &&
    progress < policy.requiredProgress
  ) {
    return "at_risk";
  }

  return "within_sla";
}

function resolveSlaSeverity(
  status: AIExecutionMonitoringSlaStatus,
): AIExecutionMonitoringSeverity {
  if (status === "breached") {
    return "critical";
  }

  if (status === "at_risk") {
    return "warning";
  }

  return "info";
}

export function assessAIExecutionMonitoringSla(
  input: AssessAIExecutionMonitoringSlaInput,
): AIExecutionMonitoringSlaAssessment {
  const assessedAt = new Date();
  const elapsedMs =
    assessedAt.getTime() - input.snapshot.context.window.startedAt.getTime();

  const status = resolveSlaStatus(
    elapsedMs,
    input.snapshot.progress,
    input.policy,
  );

  const severity = resolveSlaSeverity(status);

  const signals =
    severity === "info"
      ? []
      : [
          createAIExecutionMonitoringSignal({
            executionId: input.snapshot.context.executionId,
            type: "sla",
            severity,
            message: `Execution SLA ${status} for policy ${input.policy.name}.`,
            confidence: 0.92,
            observedAt: assessedAt,
            source: input.source ?? "ai-execution-monitoring-sla",
            metadata: {
              snapshotId: input.snapshot.id,
              policyId: input.policy.id,
              elapsedMs,
              maxDurationMs: input.policy.maxDurationMs,
              requiredProgress: input.policy.requiredProgress,
            },
          }),
        ];

  return {
    executionId: input.snapshot.context.executionId,
    policyId: input.policy.id,
    status,
    elapsedMs,
    expectedProgress: input.policy.requiredProgress,
    severity,
    signals,
    assessedAt,
  };
}