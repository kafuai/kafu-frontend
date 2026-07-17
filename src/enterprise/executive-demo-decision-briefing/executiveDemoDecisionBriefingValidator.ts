import {
  ExecutiveDecisionBriefing,
  ExecutiveDecisionBriefingOption,
} from "./executiveDemoDecisionBriefingTypes";

export interface ExecutiveDecisionBriefingValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function hasRecommendedOption(
  options: ExecutiveDecisionBriefingOption[],
): boolean {
  return options.some((option) => option.recommended === true);
}

export function validateExecutiveDecisionBriefing(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!briefing.organizationId.trim()) {
    errors.push("Organization ID is required.");
  }

  if (!briefing.companyName.trim()) {
    errors.push("Company name is required.");
  }

  if (!briefing.title.trim()) {
    errors.push("Briefing title is required.");
  }

  if (!briefing.executiveSummary.trim()) {
    errors.push("Executive summary is required.");
  }

  if (!briefing.decisionRequired.trim()) {
    errors.push("Decision required is missing.");
  }

  if (!briefing.recommendedDecision.trim()) {
    errors.push("Recommended decision is missing.");
  }

  if (!briefing.rationale.trim()) {
    errors.push("Decision rationale is missing.");
  }

  if (briefing.impactAreas.length === 0) {
    warnings.push("No business impact areas have been defined.");
  }

  if (briefing.keyMetrics.length === 0) {
    warnings.push("No executive metrics have been attached.");
  }

  if (briefing.evidence.length === 0) {
    warnings.push("No supporting evidence has been attached.");
  }

  if (briefing.actions.length === 0) {
    warnings.push("No follow-up actions have been defined.");
  }

  if (
    briefing.options.length > 0 &&
    !hasRecommendedOption(briefing.options)
  ) {
    warnings.push("Decision options exist but none is marked as recommended.");
  }

  if (
    briefing.status === "ready" &&
    (briefing.evidence.length === 0 || briefing.actions.length === 0)
  ) {
    errors.push(
      "A ready briefing must contain supporting evidence and follow-up actions.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertExecutiveDecisionBriefingValid(
  briefing: ExecutiveDecisionBriefing,
): void {
  const result = validateExecutiveDecisionBriefing(briefing);

  if (!result.valid) {
    throw new Error(
      `Invalid executive decision briefing: ${result.errors.join(" ")}`,
    );
  }
}
