import {
  ProductionReadinessQAReport,
} from "./productionReadinessQATypes";
import {
  assessProductionReadinessQA,
} from "./productionReadinessQAAssessment";

export interface ProductionReadinessQASummary {
  reportId: string;
  companyName: string;
  title: string;
  status: string;
  scorePercentage: number;
  productionReady: boolean;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  pendingChecks: number;
  unresolvedIssues: number;
  recommendations: string[];
  summary: string;
}

export function summarizeProductionReadinessQA(
  report: ProductionReadinessQAReport,
): ProductionReadinessQASummary {
  const assessment =
    assessProductionReadinessQA(report);

  return {
    reportId: report.id,
    companyName: report.companyName,
    title: report.title,
    status: report.status,
    scorePercentage: report.score.scorePercentage,
    productionReady: report.score.productionReady,
    totalChecks: report.score.totalChecks,
    passedChecks: report.score.passedChecks,
    failedChecks: report.score.failedChecks,
    warningChecks: report.score.warningChecks,
    pendingChecks: report.score.pendingChecks,
    unresolvedIssues: report.score.unresolvedIssues,
    recommendations: assessment.recommendations,
    summary:
      `${report.companyName} production readiness is ` +
      `${report.score.scorePercentage}% with ` +
      `${report.score.passedChecks}/${report.score.totalChecks} checks passed.`,
  };
}
