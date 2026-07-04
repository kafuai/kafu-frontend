import { AIExecutionRecoveryPlan } from "./aiExecutionRecoveryPlan";
import { AIExecutionRecoveryStatus } from "./aiExecutionRecoveryTypes";

export interface AIExecutionRecoveryAttempt {
  id: string;
  planId: string;
  status: AIExecutionRecoveryStatus;
  startedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export function startAIExecutionRecoveryAttempt(
  id: string,
  plan: AIExecutionRecoveryPlan,
): AIExecutionRecoveryAttempt {
  if (!id.trim()) {
    throw new Error("Recovery attempt id is required.");
  }

  return {
    id,
    planId: plan.id,
    status: "in_progress",
    startedAt: new Date(),
  };
}

export function completeAIExecutionRecoveryAttempt(
  attempt: AIExecutionRecoveryAttempt,
  recovered: boolean,
  notes?: string,
): AIExecutionRecoveryAttempt {
  return {
    ...attempt,
    status: recovered ? "recovered" : "failed",
    completedAt: new Date(),
    notes,
  };
}

export function escalateAIExecutionRecoveryAttempt(
  attempt: AIExecutionRecoveryAttempt,
  notes?: string,
): AIExecutionRecoveryAttempt {
  return {
    ...attempt,
    status: "escalated",
    completedAt: new Date(),
    notes,
  };
}