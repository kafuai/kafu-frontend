import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationPlan,
} from "./enterpriseDemoOrchestrationTypes";

export interface EnterpriseDemoOrchestrationValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEnterpriseDemoOrchestrationInput(
  input: EnterpriseDemoOrchestrationInput,
): EnterpriseDemoOrchestrationValidationResult {
  const errors: string[] = [];

  if (!input.organizationId?.trim()) {
    errors.push("Organization ID is required.");
  }

  if (!input.demoSessionId?.trim()) {
    errors.push("Demo session ID is required.");
  }

  if (!input.scenarioId?.trim()) {
    errors.push("Scenario ID is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateEnterpriseDemoOrchestrationPlan(
  plan: EnterpriseDemoOrchestrationPlan,
): EnterpriseDemoOrchestrationValidationResult {
  const errors: string[] = [];

  if (!plan.id?.trim()) {
    errors.push("Orchestration plan ID is required.");
  }

  if (plan.steps.length === 0) {
    errors.push("The orchestration plan must contain at least one step.");
  }

  const stepIds = new Set<string>();
  const sequences = new Set<number>();

  for (const step of plan.steps) {
    if (!step.id?.trim()) {
      errors.push("Every orchestration step must have an ID.");
    }

    if (stepIds.has(step.id)) {
      errors.push(`Duplicate orchestration step ID: ${step.id}.`);
    }

    if (sequences.has(step.sequence)) {
      errors.push(
        `Duplicate orchestration step sequence: ${step.sequence}.`,
      );
    }

    stepIds.add(step.id);
    sequences.add(step.sequence);
  }

  if (
    plan.currentStepId &&
    !plan.steps.some((step) => step.id === plan.currentStepId)
  ) {
    errors.push(
      `Current orchestration step does not exist: ${plan.currentStepId}.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
