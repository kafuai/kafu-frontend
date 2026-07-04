import { AIPlanningConstraint } from "./aiPlanningConstraint";
import { AIPlanningObjective } from "./aiPlanningObjective";
import { AIPlanningOption } from "./aiPlanningOption";
import { AIPlanningRoadmap } from "./aiPlanningRoadmap";

export interface AIPlanningValidationIssue {
  field: string;
  message: string;
}

export interface AIPlanningValidationResult {
  isValid: boolean;
  issues: AIPlanningValidationIssue[];
}

export function validateAIPlanningObjective(
  objective: AIPlanningObjective,
): AIPlanningValidationResult {
  const issues: AIPlanningValidationIssue[] = [];

  if (!objective.id.trim()) {
    issues.push({ field: "id", message: "Objective id is required." });
  }

  if (!objective.organizationId.trim()) {
    issues.push({
      field: "organizationId",
      message: "Organization id is required.",
    });
  }

  if (!objective.strategyId.trim()) {
    issues.push({
      field: "strategyId",
      message: "Strategy id is required.",
    });
  }

  if (!objective.title.trim()) {
    issues.push({ field: "title", message: "Objective title is required." });
  }

  if (objective.expectedOutcomes.length === 0) {
    issues.push({
      field: "expectedOutcomes",
      message: "At least one expected outcome is required.",
    });
  }

  if (objective.successMetrics.length === 0) {
    issues.push({
      field: "successMetrics",
      message: "At least one success metric is required.",
    });
  }

  if (objective.planningHorizonDays <= 0) {
    issues.push({
      field: "planningHorizonDays",
      message: "Planning horizon must be greater than zero.",
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function validateAIPlanningOption(
  option: AIPlanningOption,
): AIPlanningValidationResult {
  const issues: AIPlanningValidationIssue[] = [];

  if (!option.id.trim()) {
    issues.push({ field: "id", message: "Option id is required." });
  }

  if (!option.objectiveId.trim()) {
    issues.push({
      field: "objectiveId",
      message: "Objective id is required.",
    });
  }

  if (!option.name.trim()) {
    issues.push({ field: "name", message: "Option name is required." });
  }

  if (option.estimatedCost < 0) {
    issues.push({
      field: "estimatedCost",
      message: "Estimated cost cannot be negative.",
    });
  }

  if (option.estimatedDurationDays <= 0) {
    issues.push({
      field: "estimatedDurationDays",
      message: "Estimated duration must be greater than zero.",
    });
  }

  if (option.expectedValue < 0) {
    issues.push({
      field: "expectedValue",
      message: "Expected value cannot be negative.",
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function validateAIPlanningConstraint(
  constraint: AIPlanningConstraint,
): AIPlanningValidationResult {
  const issues: AIPlanningValidationIssue[] = [];

  if (!constraint.id.trim()) {
    issues.push({ field: "id", message: "Constraint id is required." });
  }

  if (!constraint.objectiveId.trim()) {
    issues.push({
      field: "objectiveId",
      message: "Objective id is required.",
    });
  }

  if (!constraint.title.trim()) {
    issues.push({ field: "title", message: "Constraint title is required." });
  }

  if (
    constraint.isBlocking &&
    constraint.mitigationActions.length === 0
  ) {
    issues.push({
      field: "mitigationActions",
      message: "Blocking constraints require mitigation actions.",
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function validateAIPlanningRoadmap(
  roadmap: AIPlanningRoadmap,
): AIPlanningValidationResult {
  const issues: AIPlanningValidationIssue[] = [];
  const phaseIds = new Set<string>();

  if (!roadmap.id.trim()) {
    issues.push({ field: "id", message: "Roadmap id is required." });
  }

  if (!roadmap.objectiveId.trim()) {
    issues.push({
      field: "objectiveId",
      message: "Objective id is required.",
    });
  }

  if (roadmap.phases.length === 0) {
    issues.push({
      field: "phases",
      message: "At least one roadmap phase is required.",
    });
  }

  for (const phase of roadmap.phases) {
    if (phaseIds.has(phase.id)) {
      issues.push({
        field: "phases",
        message: `Duplicate phase id: ${phase.id}`,
      });
    }

    phaseIds.add(phase.id);

    if (phase.durationDays <= 0) {
      issues.push({
        field: "phases.durationDays",
        message: `Phase ${phase.id} duration must be greater than zero.`,
      });
    }

    for (const dependencyId of phase.dependencies) {
      if (!roadmap.phases.some((candidate) => candidate.id === dependencyId)) {
        issues.push({
          field: "phases.dependencies",
          message: `Phase ${phase.id} has unknown dependency: ${dependencyId}`,
        });
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}