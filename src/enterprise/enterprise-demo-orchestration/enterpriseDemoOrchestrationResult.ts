import {
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationResult,
} from "./enterpriseDemoOrchestrationTypes";

export function calculateEnterpriseDemoOrchestrationProgress(
  plan: EnterpriseDemoOrchestrationPlan,
): number {
  if (plan.steps.length === 0) {
    return 0;
  }

  const completedSteps = plan.steps.filter(
    (step) => step.status === "completed" || step.status === "skipped",
  ).length;

  return Math.round((completedSteps / plan.steps.length) * 100);
}

export function buildEnterpriseDemoOrchestrationResult(
  plan: EnterpriseDemoOrchestrationPlan,
): EnterpriseDemoOrchestrationResult {
  const completedSteps = plan.steps.filter(
    (step) => step.status === "completed" || step.status === "skipped",
  ).length;

  const success = plan.status === "completed";

  return {
    success,
    orchestrationId: plan.id,
    status: plan.status,
    currentStepId: plan.currentStepId,
    completedSteps,
    totalSteps: plan.steps.length,
    progressPercentage:
      calculateEnterpriseDemoOrchestrationProgress(plan),
    message: resolveEnterpriseDemoOrchestrationMessage(plan),
  };
}

function resolveEnterpriseDemoOrchestrationMessage(
  plan: EnterpriseDemoOrchestrationPlan,
): string {
  switch (plan.status) {
    case "idle":
      return "Enterprise demo orchestration is idle.";
    case "preparing":
      return "Enterprise demo orchestration is being prepared.";
    case "ready":
      return "Enterprise demo orchestration is ready.";
    case "running":
      return "Enterprise demo orchestration is running.";
    case "paused":
      return "Enterprise demo orchestration is paused.";
    case "completed":
      return "Enterprise demo orchestration completed successfully.";
    case "failed":
      return "Enterprise demo orchestration failed.";
    case "cancelled":
      return "Enterprise demo orchestration was cancelled.";
    default:
      return "Enterprise demo orchestration status is unknown.";
  }
}
