import {
  ReliabilityAssessment,
  ReliabilityFailure,
  ReliabilityRecoveryAction,
} from "./reliabilityTypes";

export type ReliabilityEventType =
  | "failure.detected"
  | "assessment.created"
  | "recovery.started"
  | "recovery.completed"
  | "slo.violated"
  | "circuit.opened"
  | "fallback.activated";

export type ReliabilityEvent = {
  id: string;
  type: ReliabilityEventType;
  targetId: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
};

export function createReliabilityFailureEvent(
  failure: ReliabilityFailure,
): ReliabilityEvent {
  return {
    id: failure.id,
    type: "failure.detected",
    targetId: failure.targetId,
    occurredAt: failure.detectedAt,
    payload: {
      message: failure.message,
      severity: failure.severity,
      metadata: failure.metadata,
    },
  };
}

export function createReliabilityAssessmentEvent(
  assessment: ReliabilityAssessment,
): ReliabilityEvent {
  return {
    id: `${assessment.targetId}:assessment:${assessment.assessedAt.toISOString()}`,
    type: "assessment.created",
    targetId: assessment.targetId,
    occurredAt: assessment.assessedAt,
    payload: {
      status: assessment.status,
      severity: assessment.severity,
      failures: assessment.failures.length,
    },
  };
}

export function createReliabilityRecoveryEvent(
  targetId: string,
  action: ReliabilityRecoveryAction,
): ReliabilityEvent {
  return {
    id: `${targetId}:recovery:${action}:${Date.now()}`,
    type: "recovery.started",
    targetId,
    occurredAt: new Date(),
    payload: {
      action,
    },
  };
}