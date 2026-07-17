import {
  ProductionReadinessQACheck,
  ProductionReadinessQAReport,
} from "./productionReadinessQATypes";

export interface ProductionReadinessQAValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function hasDuplicateCheckIds(
  checks: ProductionReadinessQACheck[],
): boolean {
  return (
    new Set(checks.map((check) => check.id)).size !==
    checks.length
  );
}

export function validateProductionReadinessQAReport(
  report: ProductionReadinessQAReport,
): ProductionReadinessQAValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!report.organizationId.trim()) {
    errors.push("Organization ID is required.");
  }

  if (!report.companyName.trim()) {
    errors.push("Company name is required.");
  }

  if (!report.title.trim()) {
    errors.push("Production readiness QA title is required.");
  }

  if (report.checks.length === 0) {
    errors.push(
      "At least one production readiness check is required.",
    );
  }

  if (hasDuplicateCheckIds(report.checks)) {
    errors.push(
      "Production readiness check IDs must be unique.",
    );
  }

  report.checks.forEach((check) => {
    if (!check.id.trim()) {
      errors.push("Every QA check requires an ID.");
    }

    if (!check.title.trim()) {
      errors.push(
        `QA check ${check.id || "unknown"} requires a title.`,
      );
    }

    if (
      check.required &&
      (check.status === "failed" ||
        check.status === "pending")
    ) {
      warnings.push(
        `Required QA check is incomplete: ${check.title}.`,
      );
    }
  });

  if (
    report.score.scorePercentage < 0 ||
    report.score.scorePercentage > 100
  ) {
    errors.push(
      "Production readiness score must be between 0 and 100.",
    );
  }

  if (
    report.status === "approved" &&
    !report.score.productionReady
  ) {
    errors.push(
      "An approved QA report must be production-ready.",
    );
  }

  const unresolvedCriticalIssue = report.issues.some(
    (issue) =>
      !issue.resolved && issue.severity === "critical",
  );

  if (
    report.score.productionReady &&
    unresolvedCriticalIssue
  ) {
    errors.push(
      "A production-ready report cannot contain unresolved critical issues.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertProductionReadinessQAReportValid(
  report: ProductionReadinessQAReport,
): void {
  const result =
    validateProductionReadinessQAReport(report);

  if (!result.valid) {
    throw new Error(
      `Invalid production readiness QA report: ${result.errors.join(" ")}`,
    );
  }
}
