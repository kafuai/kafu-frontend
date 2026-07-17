import { EnterpriseDemoOrchestrationContext } from "./enterpriseDemoOrchestrationContext";

export function pauseEnterpriseDemoOrchestration(
  context: EnterpriseDemoOrchestrationContext,
): EnterpriseDemoOrchestrationContext {
  if (context.status !== "running") {
    return context;
  }

  const plan = {
    ...context.plan,
    status: "paused" as const,
    updatedAt: new Date().toISOString(),
  };

  return {
    ...context,
    plan,
    status: "paused",
  };
}

export function resumeEnterpriseDemoOrchestration(
  context: EnterpriseDemoOrchestrationContext,
): EnterpriseDemoOrchestrationContext {
  if (context.status !== "paused") {
    return context;
  }

  const plan = {
    ...context.plan,
    status: "running" as const,
    updatedAt: new Date().toISOString(),
  };

  return {
    ...context,
    plan,
    status: "running",
  };
}

export function cancelEnterpriseDemoOrchestration(
  context: EnterpriseDemoOrchestrationContext,
): EnterpriseDemoOrchestrationContext {
  if (
    context.status === "completed" ||
    context.status === "cancelled"
  ) {
    return context;
  }

  const timestamp = new Date().toISOString();

  const plan = {
    ...context.plan,
    status: "cancelled" as const,
    currentStepId: null,
    updatedAt: timestamp,
  };

  return {
    ...context,
    plan,
    status: "cancelled",
    completedAt: timestamp,
  };
}

export function resetEnterpriseDemoOrchestration(
  context: EnterpriseDemoOrchestrationContext,
): EnterpriseDemoOrchestrationContext {
  const timestamp = new Date().toISOString();

  const steps = context.plan.steps.map((step, index) => ({
    ...step,
    status: index === 0 ? ("ready" as const) : ("pending" as const),
  }));

  const plan = {
    ...context.plan,
    status: "ready" as const,
    steps,
    currentStepId: steps[0]?.id ?? null,
    updatedAt: timestamp,
  };

  return {
    ...context,
    plan,
    status: "ready",
    startedAt: null,
    completedAt: null,
    failureReason: null,
  };
}
