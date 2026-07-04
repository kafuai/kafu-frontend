import { AIAutonomousExecutionPlan } from "./aiAutonomousExecutionPlan";
import { validateAIAutonomousExecutionPlan } from "./aiAutonomousExecutionValidator";

export class AIAutonomousExecutionRegistry {
  private readonly plans = new Map<string, AIAutonomousExecutionPlan>();

  register(
    plan: AIAutonomousExecutionPlan,
  ): AIAutonomousExecutionPlan {
    validateAIAutonomousExecutionPlan(plan);

    if (this.plans.has(plan.id)) {
      throw new Error(`Execution plan already exists: ${plan.id}`);
    }

    this.plans.set(plan.id, plan);

    return plan;
  }

  upsert(
    plan: AIAutonomousExecutionPlan,
  ): AIAutonomousExecutionPlan {
    validateAIAutonomousExecutionPlan(plan);

    this.plans.set(plan.id, plan);

    return plan;
  }

  get(
    planId: string,
  ): AIAutonomousExecutionPlan | undefined {
    return this.plans.get(planId);
  }

  require(
    planId: string,
  ): AIAutonomousExecutionPlan {
    const plan = this.get(planId);

    if (!plan) {
      throw new Error(`Execution plan not found: ${planId}`);
    }

    return plan;
  }

  list(): AIAutonomousExecutionPlan[] {
    return [...this.plans.values()];
  }
}