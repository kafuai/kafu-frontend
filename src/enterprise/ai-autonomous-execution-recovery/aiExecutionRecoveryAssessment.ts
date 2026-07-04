import { AIExecutionRecoveryFailure } from "./aiExecutionRecoveryFailure";
import {
  AIExecutionRecoverySeverity,
  AIExecutionRecoveryStrategy,
} from "./aiExecutionRecoveryTypes";

export interface AIExecutionRecoveryAssessment {
  failureId: string;
  recoverable: boolean;
  severity: AIExecutionRecoverySeverity;
  recommendedStrategy: AIExecutionRecoveryStrategy;
  confidence: number;
  rationale: string;
}

export function assessAIExecutionRecovery(
  failure: AIExecutionRecoveryFailure,
): AIExecutionRecoveryAssessment {
  let strategy: AIExecutionRecoveryStrategy = "retry";

  switch (failure.type) {
    case "validation_failure":
      strategy = "rollback";
      break;

    case "dependency_failure":
      strategy = "fallback";
      break;

    case "policy_violation":
      strategy = "manual_escalation";
      break;

    case "resource_exhaustion":
      strategy = "retry";
      break;

    case "data_integrity_issue":
      strategy = "compensating_action";
      break;

    case "execution_exception":
      strategy = "retry";
      break;

    case "timeout":
      strategy = "retry";
      break;

    default:
      strategy = "manual_escalation";
  }

  return {
    failureId: failure.id,
    recoverable: failure.recoverable,
    severity: failure.severity,
    recommendedStrategy: strategy,
    confidence: failure.recoverable ? 0.9 : 0.35,
    rationale: `Recovery strategy selected based on failure type '${failure.type}'.`,
  };
}