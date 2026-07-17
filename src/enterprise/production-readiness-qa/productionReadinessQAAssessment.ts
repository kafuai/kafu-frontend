import {
  ProductionReadinessQAReport,
  ProductionReadinessQAIssue,
} from "./productionReadinessQATypes";

export interface ProductionReadinessQAAssessment {
  reportId: string;
  productionReady: boolean;
  scorePercentage: number;
  blockingIssues: ProductionReadinessQAIssue[];
  recommendations: string[];
  assessmentSummary: string;
}

export function assessProductionReadinessQA(
  report: ProductionReadinessQAReport,
): ProductionReadinessQAAssessment {
  const blockingIssues = report.issues.filter(
    (issue) =>
      !issue.resolved &&
      (issue.severity === "critical" ||
        issue.severity === "high"),
  );

  const recommendations: string[] = [];

  report.checks.forEach((check) => {
    if (
      check.required &&
      check.status !== "passed" &&
      check.status !== "not-applicable"
    ) {
      recommendations.push(
        `Complete QA check: ${check.title}.`,
      );
    }
  });

  blockingIssues.forEach((issue) => {
    recommendations.push(
      `Resolve issue: ${issue.title}.`,
    );
  });

  if (recommendations.length === 0) {
    recommendations.push(
      "Proceed to release candidate validation.",
    );
  }

  return {
    reportId: report.id,
    productionReady: report.score.productionReady,
    scorePercentage: report.score.scorePercentage,
    blockingIssues,
    recommendations,
    assessmentSummary: report.score.productionReady
      ? "Production readiness has been achieved."
      : `Production readiness score is ${report.score.scorePercentage}%.`,
  };
}
