import { AIExecutionAdaptationDecision } from "./aiExecutionAdaptationDecision";
import { AIExecutionAdaptationAction } from "./aiExecutionAdaptationTypes";

export interface AIExecutionAdaptationPlanStep {
  order: number;
  action: AIExecutionAdaptationAction;
  description: string;
}

export interface AIExecutionAdaptationPlan {
  executionId: string;
  generatedAt: Date;
  steps: AIExecutionAdaptationPlanStep[];
}

function buildDescription(action: AIExecutionAdaptationAction): string {
  switch (action) {
    case "reprioritize":
      return "Reorder execution priorities based on current conditions.";

    case "rebalance":
      return "Redistribute execution workload across available capabilities.";

    case "retry_with_adjustment":
      return "Retry failed execution using adjusted parameters.";

    case "reduce_scope":
      return "Temporarily reduce execution scope to stabilize runtime.";

    case "increase_validation":
      return "Increase validation depth before continuing execution.";

    case "escalate":
      return "Escalate execution to higher-level autonomous governance.";

    case "pause_execution":
      return "Pause execution until adaptation conditions are satisfied.";

    default:
      return "Continue execution without structural changes.";
  }
}

export function createAIExecutionAdaptationPlan(
  decision: AIExecutionAdaptationDecision,
): AIExecutionAdaptationPlan {
  return {
    executionId: decision.executionId,
    generatedAt: new Date(),
    steps: [
      {
        order: 1,
        action: decision.action,
        description: buildDescription(decision.action),
      },
    ],
  };
}