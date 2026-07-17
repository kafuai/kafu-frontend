import {
  DemoValidationCheck,
  DemoValidationIssue,
  DemoValidationReport,
  DemoValidationReportInput,
  DemoValidationScore,
} from "./demoValidationTypes";

function createDemoValidationId(
  organizationId: string,
): string {
  const normalized = organizationId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `demo-validation-${normalized || "organization"}-${Date.now()}`;
}

export function calculateDemoValidationScore(
  checks: DemoValidationCheck[],
  issues: DemoValidationIssue[],
): DemoValidationScore {
  const passedChecks = checks.filter(c => c.status === "passed").length;
  const failedChecks = checks.filter(c => c.status === "failed").length;
  const warningChecks = checks.filter(c => c.status === "warning").length;
  const pendingChecks = checks.filter(c => c.status === "pending").length;

  const requiredChecks = checks.filter(c => c.required);
  const passedRequiredChecks = requiredChecks.filter(
    c => c.status === "passed" || c.status === "not-applicable",
  ).length;

  const unresolvedIssues = issues.filter(i => !i.resolved);
  const criticalIssues = unresolvedIssues.filter(
    i => i.severity === "critical",
  ).length;

  const applicableChecks = checks.filter(
    c => c.status !== "not-applicable",
  );

  const earned =
    applicableChecks.reduce((total, check) => {
      if (check.status === "passed") return total + 1;
      if (check.status === "warning") return total + 0.5;
      return total;
    }, 0);

  const scorePercentage =
    applicableChecks.length === 0
      ? 100
      : Math.round((earned / applicableChecks.length) * 100);

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
    demoReady:
      scorePercentage >= 95 &&
      failedChecks === 0 &&
      criticalIssues === 0 &&
      passedRequiredChecks === requiredChecks.length,
  };
}

export function createDemoValidationReport(
  input: DemoValidationReportInput,
): DemoValidationReport {
  const timestamp = new Date().toISOString();
  const issues = input.issues ?? [];
  const score = calculateDemoValidationScore(
    input.checks,
    issues,
  );

  return {
    id: createDemoValidationId(input.organizationId),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title:
      input.title?.trim() ??
      `${input.companyName.trim()} Demo Validation`,
    status: score.demoReady ? "ready" : "not-started",
    checks: input.checks,
    issues,
    score,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function refreshDemoValidationReport(
  report: DemoValidationReport,
): DemoValidationReport {
  const score = calculateDemoValidationScore(
    report.checks,
    report.issues,
  );

  return {
    ...report,
    status: score.demoReady
      ? "ready"
      : score.criticalIssues > 0
        ? "blocked"
        : "in-progress",
    score,
    updatedAt: new Date().toISOString(),
  };
}
