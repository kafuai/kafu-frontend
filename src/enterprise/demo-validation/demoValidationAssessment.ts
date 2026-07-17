import {
  DemoValidationIssue,
  DemoValidationReport,
} from "./demoValidationTypes";

export interface DemoValidationAssessment {
  reportId: string;
  demoReady: boolean;
  scorePercentage: number;
  blockingIssues: DemoValidationIssue[];
  failedChecks: string[];
  pendingChecks: string[];
  recommendations: string[];
  assessmentSummary: string;
}

export function assessDemoValidation(
  report: DemoValidationReport,
): DemoValidationAssessment {
  const blockingIssues = report.issues.filter(
    (issue) =>
      !issue.resolved &&
      (issue.severity === "critical" ||
        issue.severity === "high"),
  );

  const failedChecks = report.checks
    .filter((check) => check.status === "failed")
    .map((check) => check.title);

  const pendingChecks = report.checks
    .filter((check) => check.status === "pending")
    .map((check) => check.title);

  const recommendations: string[] = [];

  failedChecks.forEach((title) => {
    recommendations.push(
      `Resolve failed validation check: ${title}.`,
    );
  });

  pendingChecks.forEach((title) => {
    recommendations.push(
      `Complete pending validation check: ${title}.`,
    );
  });

  blockingIssues.forEach((issue) => {
    recommendations.push(
      `Resolve blocking demo issue: ${issue.title}.`,
    );
  });

  if (recommendations.length === 0) {
    recommendations.push(
      "Proceed to release candidate preparation.",
    );
  }

  return {
    reportId: report.id,
    demoReady: report.score.demoReady,
    scorePercentage: report.score.scorePercentage,
    blockingIssues,
    failedChecks,
    pendingChecks,
    recommendations,
    assessmentSummary: report.score.demoReady
      ? "Executive demo validation is complete."
      : `Executive demo validation score is ${report.score.scorePercentage}%.`,
  };
}
