import {
  AIExecutionRecoveryAuditMetadata,
  AIExecutionRecoveryFailureType,
  AIExecutionRecoverySeverity,
  AIExecutionRecoveryStatus,
} from "./aiExecutionRecoveryTypes";

export interface AIExecutionRecoveryFailureInput {
  id: string;
  executionId: string;
  stepId?: string;
  type?: AIExecutionRecoveryFailureType;
  severity?: AIExecutionRecoverySeverity;
  message: string;
  cause?: string;
  occurredAt?: Date;
  recoverable?: boolean;
  metadata: AIExecutionRecoveryAuditMetadata;
}

export interface AIExecutionRecoveryFailure {
  id: string;
  executionId: string;
  stepId?: string;
  type: AIExecutionRecoveryFailureType;
  severity: AIExecutionRecoverySeverity;
  status: AIExecutionRecoveryStatus;
  message: string;
  cause?: string;
  occurredAt: Date;
  recoverable: boolean;
  metadata: AIExecutionRecoveryAuditMetadata;
}

export function createAIExecutionRecoveryFailure(
  input: AIExecutionRecoveryFailureInput,
): AIExecutionRecoveryFailure {
  if (!input.id.trim()) {
    throw new Error("Recovery failure id is required.");
  }

  if (!input.executionId.trim()) {
    throw new Error("Recovery failure executionId is required.");
  }

  if (!input.message.trim()) {
    throw new Error("Recovery failure message is required.");
  }

  return {
    id: input.id,
    executionId: input.executionId,
    stepId: input.stepId,
    type: input.type ?? "unknown",
    severity: input.severity ?? "medium",
    status: "detected",
    message: input.message,
    cause: input.cause,
    occurredAt: input.occurredAt ?? new Date(),
    recoverable: input.recoverable ?? true,
    metadata: input.metadata,
  };
}

export function markAIExecutionRecoveryFailureStatus(
  failure: AIExecutionRecoveryFailure,
  status: AIExecutionRecoveryStatus,
): AIExecutionRecoveryFailure {
  return {
    ...failure,
    status,
  };
}