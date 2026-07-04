import {
  AIAutonomousExecutionPlan,
  markAIAutonomousExecutionPlanStatus,
} from "./aiAutonomousExecutionPlan";
import { validateAIAutonomousExecutionPlan } from "./aiAutonomousExecutionValidator";

export function prepareAIAutonomousExecutionPlan(
  plan: AIAutonomousExecutionPlan,
): AIAutonomousExecutionPlan {
  validateAIAutonomousExecutionPlan(plan);

  return markAIAutonomousExecutionPlanStatus(plan, "ready");
}