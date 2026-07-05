import type { ExecutionCoordinationPlan } from "./executionCoordinationPlan";

export class ExecutionCoordinationRegistry {
  private readonly plans = new Map<string, ExecutionCoordinationPlan>();

  register(plan: ExecutionCoordinationPlan): void {
    this.plans.set(plan.id, plan);
  }

  get(planId: string): ExecutionCoordinationPlan | undefined {
    return this.plans.get(planId);
  }

  has(planId: string): boolean {
    return this.plans.has(planId);
  }

  list(): readonly ExecutionCoordinationPlan[] {
    return Array.from(this.plans.values());
  }

  remove(planId: string): boolean {
    return this.plans.delete(planId);
  }
}