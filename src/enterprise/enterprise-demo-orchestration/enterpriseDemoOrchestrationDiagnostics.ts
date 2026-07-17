import { EnterpriseDemoOrchestrationContext } from "./enterpriseDemoOrchestrationContext";
import { calculateEnterpriseDemoOrchestrationProgress } from "./enterpriseDemoOrchestrationResult";
import { validateEnterpriseDemoOrchestrationPlan } from "./enterpriseDemoOrchestrationValidator";

export type EnterpriseDemoOrchestrationHealth =
  | "healthy"
  | "warning"
  | "critical";

export interface EnterpriseDemoOrchestrationDiagnostics {
  orchestrationId: string;
  health: EnterpriseDemoOrchestrationHealth;
  status: EnterpriseDemoOrchestrationContext["status"];
  progressPercentage: number;
  completedSteps: number;
  failedSteps: number;
  pendingSteps: number;
  activeStepId?: string | null;
  issues: string[];
  generatedAt: string;
}

export function diagnoseEnterpriseDemoOrchestration(
  context: EnterpriseDemoOrchestrationContext,
): EnterpriseDemoOrchestrationDiagnostics {
  const planValidation =
    validateEnterpriseDemoOrchestrationPlan(context.plan);

  const completedSteps = context.plan.steps.filter(
    (step) =>
      step.status === "completed" ||
      step.status === "skipped",
  ).length;

  const failedSteps = context.plan.steps.filter(
    (step) => step.status === "failed",
  ).length;

  const pendingSteps = context.plan.steps.filter(
    (step) =>
      step.status === "pending" ||
      step.status === "ready",
  ).length;

  const issues = [...planValidation.errors];

  if (
    context.status === "running" &&
    !context.plan.currentStepId
  ) {
    issues.push(
      "Running orchestration does not have an active step.",
    );
  }

  if (
    context.status === "failed" &&
    !context.failureReason
  ) {
    issues.push(
      "Failed orchestration does not include a failure reason.",
    );
  }

  if (
    context.status === "completed" &&
    completedSteps < context.plan.steps.length
  ) {
    issues.push(
      "Completed orchestration still contains unfinished steps.",
    );
  }

  const health: EnterpriseDemoOrchestrationHealth =
    failedSteps > 0 ||
    context.status === "failed" ||
    !planValidation.valid
      ? "critical"
      : issues.length > 0 ||
          context.status === "paused" ||
          context.status === "cancelled"
        ? "warning"
        : "healthy";

  return {
    orchestrationId: context.orchestrationId,
    health,
    status: context.status,
    progressPercentage:
      calculateEnterpriseDemoOrchestrationProgress(context.plan),
    completedSteps,
    failedSteps,
    pendingSteps,
    activeStepId: context.plan.currentStepId,
    issues,
    generatedAt: new Date().toISOString(),
  };
}
