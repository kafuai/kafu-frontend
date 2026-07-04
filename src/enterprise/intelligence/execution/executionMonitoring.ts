import { ExecutionPlan } from "./executionTypes";

export type ExecutionMonitoringStatus =
  | "not_started"
  | "in_progress"
  | "at_risk"
  | "blocked"
  | "completed";

export type ExecutionMonitoringSnapshot = {
  executionPlanId: string;
  organizationId: string;
  status: ExecutionMonitoringStatus;
  progress: number;
  totalActions: number;
  completedActions: number;
  blockedActions: number;
  risks: string[];
  updatedAt: Date;
};

export function createExecutionMonitoringSnapshot(
  plan: ExecutionPlan,
): ExecutionMonitoringSnapshot {
  const totalActions = plan.actions.length;

  const completedActions = plan.status === "completed" ? totalActions : 0;
  const blockedActions = plan.status === "failed" ? totalActions : 0;

  const progress =
    plan.status === "completed" ? 100 : plan.status === "running" ? 50 : 0;

  let status: ExecutionMonitoringStatus = "not_started";

  if (plan.status === "completed") {
    status = "completed";
  } else if (plan.status === "failed") {
    status = "blocked";
  } else if (plan.status === "running") {
    status = "in_progress";
  } else if (plan.priority === "critical") {
    status = "at_risk";
  }

  return {
    executionPlanId: plan.id,
    organizationId: plan.organizationId,
    status,
    progress,
    totalActions,
    completedActions,
    blockedActions,
    risks: plan.priority === "critical" ? ["Critical execution priority"] : [],
    updatedAt: new Date(),
  };
}