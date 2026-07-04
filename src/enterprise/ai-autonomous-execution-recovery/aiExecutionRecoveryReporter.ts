import { AIExecutionRecoveryAssessment } from "./aiExecutionRecoveryAssessment";
import { AIExecutionRecoveryFailure } from "./aiExecutionRecoveryFailure";
import { AIExecutionRecoveryPlan } from "./aiExecutionRecoveryPlan";
import { AIExecutionRecoveryAttempt } from "./aiExecutionRecoveryTracker";

export interface AIExecutionRecoveryReport {
  executionId: string;
  failureId: string;
  recoverable: boolean;
  strategy: string;
  finalStatus: string;
  confidence: number;
  generatedAt: Date;
}

export interface AIExecutionRecoveryReporterInput {
  failure: AIExecutionRecoveryFailure;
  assessment: AIExecutionRecoveryAssessment;
  plan: AIExecutionRecoveryPlan;
  attempt: AIExecutionRecoveryAttempt;
}

export function createAIExecutionRecoveryReport(
  input: AIExecutionRecoveryReporterInput,
): AIExecutionRecoveryReport {
  return {
    executionId: input.failure.executionId,
    failureId: input.failure.id,
    recoverable: input.assessment.recoverable,
    strategy: input.plan.strategy,
    finalStatus: input.attempt.status,
    confidence: input.assessment.confidence,
    generatedAt: new Date(),
  };
}