import { ExecutionPlan } from "./executionTypes";

export type ExecutionContext = {
  organizationId: string;
  plan: ExecutionPlan;
  metadata: Record<string, unknown>;
  createdAt: Date;
};

export function createExecutionContext(
  plan: ExecutionPlan,
  metadata: Record<string, unknown> = {},
): ExecutionContext {
  return {
    organizationId: plan.organizationId,
    plan,
    metadata,
    createdAt: new Date(),
  };
}