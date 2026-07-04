import { AIOrchestrationWorkflow } from "./aiOrchestrationTypes";

export interface AIOrchestrationValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface AIOrchestrationValidationResult {
  valid: boolean;
  issues: AIOrchestrationValidationIssue[];
}

export function validateAIOrchestrationWorkflow(
  workflow: AIOrchestrationWorkflow,
): AIOrchestrationValidationResult {
  const issues: AIOrchestrationValidationIssue[] = [];

  if (!workflow.id.trim()) {
    issues.push({
      field: "id",
      message: "Workflow id is required.",
      severity: "error",
    });
  }

  if (!workflow.organizationId.trim()) {
    issues.push({
      field: "organizationId",
      message: "Organization id is required.",
      severity: "error",
    });
  }

  if (!workflow.name.trim()) {
    issues.push({
      field: "name",
      message: "Workflow name is required.",
      severity: "error",
    });
  }

  if (!workflow.objective.trim()) {
    issues.push({
      field: "objective",
      message: "Workflow objective is required.",
      severity: "error",
    });
  }

  if (workflow.steps.length === 0) {
    issues.push({
      field: "steps",
      message: "Workflow should include at least one orchestration step.",
      severity: "warning",
    });
  }

  const stepIds = new Set(workflow.steps.map((step) => step.id));

  for (const step of workflow.steps) {
    if (!step.name.trim()) {
      issues.push({
        field: `steps.${step.id}.name`,
        message: "Step name is required.",
        severity: "error",
      });
    }

    for (const dependency of step.dependencies) {
      if (!stepIds.has(dependency.stepId)) {
        issues.push({
          field: `steps.${step.id}.dependencies`,
          message: `Dependency step '${dependency.stepId}' does not exist in workflow.`,
          severity: "error",
        });
      }

      if (dependency.stepId === step.id) {
        issues.push({
          field: `steps.${step.id}.dependencies`,
          message: "Step cannot depend on itself.",
          severity: "error",
        });
      }
    }
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    issues,
  };
}