import type { ExecutionCoordinationPlan } from "./executionCoordinationPlan";

export class ExecutionCoordinationEngine {
  canExecute(plan: ExecutionCoordinationPlan): boolean {
    return (
      plan.executable &&
      plan.coordinators.some((coordinator) => coordinator.available)
    );
  }
}