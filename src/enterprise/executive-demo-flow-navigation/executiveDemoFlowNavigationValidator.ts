import {
  ExecutiveDemoFlowNavigation,
  ExecutiveDemoFlowNavigationStep,
} from "./executiveDemoFlowNavigationTypes";

export interface ExecutiveDemoFlowNavigationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function hasDuplicateStepIds(
  steps: ExecutiveDemoFlowNavigationStep[],
): boolean {
  return new Set(steps.map((step) => step.id)).size !== steps.length;
}

function hasDuplicateStepOrders(
  steps: ExecutiveDemoFlowNavigationStep[],
): boolean {
  return new Set(steps.map((step) => step.order)).size !== steps.length;
}

export function validateExecutiveDemoFlowNavigation(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!flow.organizationId.trim()) {
    errors.push("Organization ID is required.");
  }

  if (!flow.companyName.trim()) {
    errors.push("Company name is required.");
  }

  if (!flow.title.trim()) {
    errors.push("Executive demo flow title is required.");
  }

  if (flow.steps.length === 0) {
    errors.push("At least one executive demo flow step is required.");
  }

  if (hasDuplicateStepIds(flow.steps)) {
    errors.push("Executive demo flow step IDs must be unique.");
  }

  if (hasDuplicateStepOrders(flow.steps)) {
    errors.push("Executive demo flow step orders must be unique.");
  }

  flow.steps.forEach((step) => {
    if (!step.id.trim()) {
      errors.push("Every executive demo flow step requires an ID.");
    }

    if (!step.title.trim()) {
      errors.push(`Step ${step.id || "unknown"} requires a title.`);
    }

    if (!step.route.path.startsWith("/")) {
      errors.push(`Step ${step.id} route must start with "/".`);
    }
  });

  const openingStep = flow.steps.find((step) => step.type === "opening");
  const closingStep = flow.steps.find((step) => step.type === "closing");

  if (!openingStep) {
    warnings.push("Executive demo flow has no opening step.");
  }

  if (!closingStep) {
    warnings.push("Executive demo flow has no closing step.");
  }

  if (
    flow.progress.completionPercentage < 0 ||
    flow.progress.completionPercentage > 100
  ) {
    errors.push("Completion percentage must be between 0 and 100.");
  }

  if (
    flow.status === "completed" &&
    flow.progress.completionPercentage !== 100
  ) {
    errors.push("A completed flow must have 100 percent completion.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertExecutiveDemoFlowNavigationValid(
  flow: ExecutiveDemoFlowNavigation,
): void {
  const result = validateExecutiveDemoFlowNavigation(flow);

  if (!result.valid) {
    throw new Error(
      `Invalid executive demo flow navigation: ${result.errors.join(" ")}`,
    );
  }
}
