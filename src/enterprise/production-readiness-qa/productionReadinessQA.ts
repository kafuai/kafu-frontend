import {
  ProductionReadinessQACheck,
  ProductionReadinessQAIssue,
  ProductionReadinessQAReport,
  ProductionReadinessQAReportInput,
  ProductionReadinessQAScore,
} from "./productionReadinessQATypes";

function createProductionReadinessQAId(
  organizationId: string,
): string {
  const normalizedOrganizationId = organizationId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `production-readiness-qa-${
    normalizedOrganizationId || "organization"
  }-${Date.now()}`;
}

export function calculateProductionReadinessQAScore(
  checks: ProductionReadinessQACheck[],
  issues: ProductionReadinessQAIssue[],
): ProductionReadinessQAScore {
  const passedChecks = checks.filter(
    (check) => check.status === "passed",
  ).length;

  const failedChecks = checks.filter(
    (check) => check.status === "failed",
  ).length;

  const warningChecks = checks.filter(
    (check) => check.status === "warning",
  ).length;

  const pendingChecks = checks.filter(
    (check) => check.status === "pending",
  ).length;

  const requiredChecks = checks.filter(
    (check) => check.required,
  );

  const passedRequiredChecks = requiredChecks.filter(
    (check) =>
      check.status === "passed" ||
      check.status === "not-applicable",
  ).length;

  const unresolvedIssues = issues.filter(
    (issue) => !issue.resolved,
  );

  const criticalIssues = unresolvedIssues.filter(
    (issue) => issue.severity === "critical",
  ).length;

  const applicableChecks = checks.filter(
    (check) => check.status !== "not-applicable",
  );

  const earnedPoints = applicableChecks.reduce(
    (total, check) => {
      if (check.status === "passed") {
        return total + 1;
      }

      if (check.status === "warning") {
        return total + 0.5;
      }

      return total;
    },
    0,
  );

  const rawPercentage =
    applicableChecks.length === 0
      ? 100
      : Math.round(
          (earnedPoints / applicableChecks.length) * 100,
        );

  const issuePenalty = unresolvedIssues.reduce(
    (total, issue) => {
      switch (issue.severity) {
        case "critical":
          return total + 25;
        case "high":
          return total + 15;
        case "medium":
          return total + 7;
        case "low":
          return total + 2;
      }
    },
    0,
  );

  const scorePercentage = Math.max(
    0,
    rawPercentage - Math.min(issuePenalty, 60),
  );

  const allRequiredChecksPassed =
    passedRequiredChecks === requiredChecks.length;

  return {
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    warningChecks,
    pendingChecks,
    requiredChecks: requiredChecks.length,
    passedRequiredChecks,
    unresolvedIssues: unresolvedIssues.length,
    criticalIssues,
    scorePercentage,
    productionReady:
      scorePercentage >= 90 &&
      allRequiredChecksPassed &&
      criticalIssues === 0 &&
      failedChecks === 0,
  };
}

export function createProductionReadinessQAReport(
  input: ProductionReadinessQAReportInput,
): ProductionReadinessQAReport {
  const timestamp = new Date().toISOString();
  const issues = input.issues ?? [];
  const score = calculateProductionReadinessQAScore(
    input.checks,
    issues,
  );

  return {
    id: createProductionReadinessQAId(
      input.organizationId,
    ),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title:
      input.title?.trim() ||
      `${input.companyName.trim()} Production Readiness & QA`,
    status: score.productionReady ? "ready" : "not-started",
    checks: input.checks,
    issues,
    score,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function refreshProductionReadinessQAReport(
  report: ProductionReadinessQAReport,
): ProductionReadinessQAReport {
  const score = calculateProductionReadinessQAScore(
    report.checks,
    report.issues,
  );

  return {
    ...report,
    status: score.productionReady
      ? "ready"
      : score.criticalIssues > 0
        ? "blocked"
        : "in-progress",
    score,
    updatedAt: new Date().toISOString(),
  };
}

export function approveProductionReadinessQAReport(
  report: ProductionReadinessQAReport,
): ProductionReadinessQAReport {
  const refreshedReport =
    refreshProductionReadinessQAReport(report);

  if (!refreshedReport.score.productionReady) {
    throw new Error(
      "Production readiness QA report cannot be approved before all required checks pass.",
    );
  }

  const timestamp = new Date().toISOString();

  return {
    ...refreshedReport,
    status: "approved",
    approvedAt: timestamp,
    updatedAt: timestamp,
  };
}
