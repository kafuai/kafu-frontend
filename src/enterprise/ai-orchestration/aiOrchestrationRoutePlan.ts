import {
  AIOrchestrationCapabilityRegistry,
} from "./aiOrchestrationCapabilityRegistry";
import { AIOrchestrationContext } from "./aiOrchestrationContext";
import { AIOrchestrationPlan } from "./aiOrchestrationPlanner";
import {
  AIOrchestrationRouteDecision,
  routeAIOrchestrationStep,
} from "./aiOrchestrationRouter";

export interface AIOrchestrationRoutePlan {
  workflowId: string;
  executionId: string;
  decisions: AIOrchestrationRouteDecision[];
  routable: boolean;
}

export function createAIOrchestrationRoutePlan(
  plan: AIOrchestrationPlan,
  executionId: string,
  context: AIOrchestrationContext,
  registry: AIOrchestrationCapabilityRegistry,
): AIOrchestrationRoutePlan {
  const decisions = plan.items.map((item) =>
    routeAIOrchestrationStep(item.step, context, registry),
  );

  return {
    workflowId: plan.workflowId,
    executionId,
    decisions,
    routable: decisions.every((decision) => decision.routed),
  };
}