import { AISafetyReport } from "./aiSafetyReport";
import { AISafetyRiskLevel, AISafetyStatus } from "./aiSafetyTypes";

export interface AISafetyMetrics {
  totalEvaluations: number;
  safeEvaluations: number;
  reviewRequiredEvaluations: number;
  blockedEvaluations: number;
  unsafeEvaluations: number;
  criticalRiskCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export function calculateAISafetyMetrics(
  reports: AISafetyReport[],
): AISafetyMetrics {
  return reports.reduce<AISafetyMetrics>(
    (metrics, report) => {
      metrics.totalEvaluations += 1;

      if (report.decision.status === AISafetyStatus.SAFE) {
        metrics.safeEvaluations += 1;
      }

      if (report.decision.status === AISafetyStatus.NEEDS_REVIEW) {
        metrics.reviewRequiredEvaluations += 1;
      }

      if (report.decision.status === AISafetyStatus.BLOCKED) {
        metrics.blockedEvaluations += 1;
      }

      if (report.decision.status === AISafetyStatus.UNSAFE) {
        metrics.unsafeEvaluations += 1;
      }

      if (report.decision.riskLevel === AISafetyRiskLevel.CRITICAL) {
        metrics.criticalRiskCount += 1;
      }

      if (report.decision.riskLevel === AISafetyRiskLevel.HIGH) {
        metrics.highRiskCount += 1;
      }

      if (report.decision.riskLevel === AISafetyRiskLevel.MEDIUM) {
        metrics.mediumRiskCount += 1;
      }

      if (report.decision.riskLevel === AISafetyRiskLevel.LOW) {
        metrics.lowRiskCount += 1;
      }

      return metrics;
    },
    {
      totalEvaluations: 0,
      safeEvaluations: 0,
      reviewRequiredEvaluations: 0,
      blockedEvaluations: 0,
      unsafeEvaluations: 0,
      criticalRiskCount: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
    },
  );
}