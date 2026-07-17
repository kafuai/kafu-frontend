import {
  FinalPolishItem,
  FinalPolishPlan,
} from "./finalPolishTypes";

export interface FinalPolishValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function hasDuplicateItemIds(
  items: FinalPolishItem[],
): boolean {
  return (
    new Set(items.map((item) => item.id)).size !==
    items.length
  );
}

export function validateFinalPolishPlan(
  plan: FinalPolishPlan,
): FinalPolishValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!plan.organizationId.trim()) {
    errors.push("Organization ID is required.");
  }

  if (!plan.companyName.trim()) {
    errors.push("Company name is required.");
  }

  if (!plan.title.trim()) {
    errors.push("Final polish title is required.");
  }

  if (plan.items.length === 0) {
    errors.push(
      "At least one final polish item is required.",
    );
  }

  if (hasDuplicateItemIds(plan.items)) {
    errors.push("Final polish item IDs must be unique.");
  }

  plan.items.forEach((item) => {
    if (!item.id.trim()) {
      errors.push("Every final polish item requires an ID.");
    }

    if (!item.title.trim()) {
      errors.push(
        `Final polish item ${item.id || "unknown"} requires a title.`,
      );
    }

    if (
      item.required &&
      item.status !== "completed" &&
      item.status !== "not-applicable"
    ) {
      warnings.push(
        `Required final polish item is incomplete: ${item.title}.`,
      );
    }
  });

  if (
    plan.score.scorePercentage < 0 ||
    plan.score.scorePercentage > 100
  ) {
    errors.push(
      "Final polish score must be between 0 and 100.",
    );
  }

  if (
    plan.status === "approved" &&
    !plan.score.polishReady
  ) {
    errors.push(
      "An approved final polish plan must be ready.",
    );
  }

  const unresolvedCriticalIssue = plan.issues.some(
    (issue) =>
      !issue.resolved &&
      issue.priority === "critical",
  );

  if (
    plan.score.polishReady &&
    unresolvedCriticalIssue
  ) {
    errors.push(
      "A polish-ready plan cannot contain unresolved critical issues.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertFinalPolishPlanValid(
  plan: FinalPolishPlan,
): void {
  const result = validateFinalPolishPlan(plan);

  if (!result.valid) {
    throw new Error(
      `Invalid final polish plan: ${result.errors.join(" ")}`,
    );
  }
}
