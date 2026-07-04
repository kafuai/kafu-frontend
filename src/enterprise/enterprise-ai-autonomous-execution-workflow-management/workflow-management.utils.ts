import {
  WorkflowManagementDecision,
  WorkflowManagementRecord,
  WorkflowManagementStatus,
  WorkflowReadinessSummary,
  WorkflowStepDefinition,
} from "./workflow-management.types";

const terminalStepStatuses = new Set(["completed", "failed", "skipped"]);

export function calculateWorkflowReadiness(
  workflow: WorkflowManagementRecord,
): WorkflowReadinessSummary {
  const totalSteps = workflow.steps.length;
  const readySteps = workflow.steps.filter((step) => step.status === "ready").length;
  const blockedSteps = workflow.steps.filter((step) => step.status === "blocked").length;
  const completedSteps = workflow.steps.filter((step) => step.status === "completed").length;
  const failedSteps = workflow.steps.filter((step) => step.status === "failed").length;
  const automationEligibleSteps = workflow.steps.filter(
    (step) => step.automationEligible,
  ).length;

  const readinessScore =
    totalSteps === 0
      ? 0
      : Math.round(((readySteps + completedSteps) / totalSteps) * 100);

  return {
    workflowId: workflow.id,
    totalSteps,
    readySteps,
    blockedSteps,
    completedSteps,
    failedSteps,
    automationEligibleSteps,
    readinessScore,
  };
}

export function isWorkflowStepExecutable(
  step: WorkflowStepDefinition,
  allSteps: readonly WorkflowStepDefinition[],
): boolean {
  if (terminalStepStatuses.has(step.status) || step.status === "blocked") {
    return false;
  }

  return step.dependencies.every((dependency) => {
    const dependencyStep = allSteps.find(
      (candidate) => candidate.id === dependency.dependencyStepId,
    );

    if (!dependencyStep) {
      return !dependency.blocking;
    }

    return dependencyStep.status === dependency.requiredStatus;
  });
}

export function recommendWorkflowStatus(
  workflow: WorkflowManagementRecord,
): WorkflowManagementDecision {
  const readiness = calculateWorkflowReadiness(workflow);
  const reasons: string[] = [];
  const risks: string[] = [];

  let recommendedStatus: WorkflowManagementStatus = workflow.status;

  if (readiness.failedSteps > 0) {
    recommendedStatus = "blocked";
    risks.push("Workflow contains failed steps that require intervention.");
  } else if (readiness.blockedSteps > 0) {
    recommendedStatus = "blocked";
    risks.push("Workflow contains blocked steps.");
  } else if (
    readiness.totalSteps > 0 &&
    readiness.completedSteps === readiness.totalSteps
  ) {
    recommendedStatus = "completed";
    reasons.push("All workflow steps are completed.");
  } else if (readiness.readySteps > 0 || readiness.readinessScore > 0) {
    recommendedStatus = "active";
    reasons.push("Workflow has executable or progressing steps.");
  } else if (workflow.steps.length === 0) {
    recommendedStatus = "draft";
    risks.push("Workflow has no defined steps.");
  }

  if (readiness.automationEligibleSteps > 0) {
    reasons.push("Workflow contains automation-eligible steps.");
  }

  return {
    workflowId: workflow.id,
    recommendedStatus,
    readiness,
    reasons,
    risks,
  };
}