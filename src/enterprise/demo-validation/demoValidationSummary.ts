import {
  assessDemoValidation,
} from "./demoValidationAssessment";
import {
  DemoValidationReport,
} from "./demoValidationTypes";

export interface DemoValidationSummary {
  reportId: string;
  companyName: string;
  title: string;
  status: string;
  scorePercentage: number;
  demoReady: boolean;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  pendingChecks: number;
  unresolvedIssues: number;
  recommendations: string[];
  summary: string;
}

export function summarizeDemoValidation(
  report: DemoValidationReport,
): DemoValidationSummary {
  const assessment = assessDemoValidation(report);

  return {
    reportId: report.id,
    companyName: report.companyName,
    title: report.title,
    status: report.status,
    scorePercentage: report.score.scorePercentage,
    demoReady: report.score.demoReady,
    totalChecks: report.score.totalChecks,
    passedChecks: report.score.passedChecks,
    failedChecks: report.score.failedChecks,
    warningChecks: report.score.warningChecks,
    pendingChecks: report.score.pendingChecks,
    unresolvedIssues:
      report.score.unresolvedIssues,
    recommendations: assessment.recommendations,
    summary:
      `${report.companyName} demo validation is ` +
      `${report.score.scorePercentage}% complete with ` +
      `${report.score.passedChecks}/${report.score.totalChecks} checks passed.`,
  };
}
