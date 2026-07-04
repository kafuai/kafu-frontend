import { AIExecutionRecoveryAssessment } from "./aiExecutionRecoveryAssessment";
import {
  AIExecutionRecoveryAuditMetadata,
  AIExecutionRecoveryStrategy,
} from "./aiExecutionRecoveryTypes";

export interface AIExecutionRecoveryPlanStep {
  id: string;
  strategy: AIExecutionRecoveryStrategy;
  description: string;
  required: boolean;
  order: number;
}

export interface AIExecutionRecoveryPlan {
  id: string;
  failureId: string;
  recoverable: boolean;
  strategy: AIExecutionRecoveryStrategy;
  steps: AIExecutionRecoveryPlanStep[];
  metadata: AIExecutionRecoveryAuditMetadata;
}

export interface AIExecutionRecoveryPlanInput {
  id: string;
  assessment: AIExecutionRecoveryAssessment;
  metadata: AIExecutionRecoveryAuditMetadata;
}

export function createAIExecutionRecoveryPlan(
  input: AIExecutionRecoveryPlanInput,
): AIExecutionRecoveryPlan {
  if (!input.id.trim()) {
    throw new Error("Recovery plan id is required.");
  }

  const strategy = input.assessment.recommendedStrategy;

  return {
    id: input.id,
    failureId: input.assessment.failureId,
    recoverable: input.assessment.recoverable,
    strategy,
    steps: createRecoverySteps(strategy),
    metadata: input.metadata,
  };
}

function createRecoverySteps(
  strategy: AIExecutionRecoveryStrategy,
): AIExecutionRecoveryPlanStep[] {
  switch (strategy) {
    case "retry":
      return [
        {
          id: "retry-execution",
          strategy,
          description: "Retry the failed execution step with preserved context.",
          required: true,
          order: 1,
        },
      ];

    case "fallback":
      return [
        {
          id: "activate-fallback",
          strategy,
          description: "Route execution to the configured fallback capability.",
          required: true,
          order: 1,
        },
      ];

    case "rollback":
      return [
        {
          id: "rollback-state",
          strategy,
          description: "Rollback execution state to the last known valid checkpoint.",
          required: true,
          order: 1,
        },
      ];

    case "compensating_action":
      return [
        {
          id: "apply-compensation",
          strategy,
          description: "Apply compensating action to restore business consistency.",
          required: true,
          order: 1,
        },
      ];

    case "manual_escalation":
      return [
        {
          id: "escalate-manually",
          strategy,
          description: "Escalate recovery decision to an authorized operator.",
          required: true,
          order: 1,
        },
      ];

    case "skip":
      return [
        {
          id: "skip-step",
          strategy,
          description: "Skip the failed step when policy allows non-critical continuation.",
          required: true,
          order: 1,
        },
      ];

    case "halt_execution":
      return [
        {
          id: "halt-execution",
          strategy,
          description: "Halt execution to prevent further propagation of failure.",
          required: true,
          order: 1,
        },
      ];
  }
}