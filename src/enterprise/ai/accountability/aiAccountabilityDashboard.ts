import {
  AIAccountabilityMetrics,
  calculateAccountabilityAssignmentCoverage,
  calculateHumanReviewCoverage,
} from "./aiAccountabilityMetrics";
import { AIAccountabilityReport } from "./aiAccountabilityReporter";

export type AIAccountabilityDashboardSignalLevel =
  | "positive"
  | "neutral"
  | "warning"
  | "critical";

export interface AIAccountabilityDashboardCard {
  id: string;
  title: string;
  value: string;
  signalLevel: AIAccountabilityDashboardSignalLevel;
  description: string;
}

export interface AIAccountabilityDashboard {
  organizationId: string;
  cards: AIAccountabilityDashboardCard[];
  reportStatus: string;
  generatedAt: Date;
}

export function buildAIAccountabilityDashboard(
  organizationId: string,
  metrics: AIAccountabilityMetrics,
  report: AIAccountabilityReport,
  now: Date = new Date(),
): AIAccountabilityDashboard {
  const humanReviewCoverage = calculateHumanReviewCoverage(metrics);
  const assignmentCoverage = calculateAccountabilityAssignmentCoverage(metrics);

  return {
    organizationId,
    reportStatus: report.status,
    cards: [
      {
        id: "total-decisions",
        title: "Accountable Decisions",
        value: String(metrics.totalDecisions),
        signalLevel: "neutral",
        description: "Total AI decisions registered for accountability tracking.",
      },
      {
        id: "assignment-coverage",
        title: "Ownership Coverage",
        value: `${Math.round(assignmentCoverage * 100)}%`,
        signalLevel: assignmentCoverage >= 0.95 ? "positive" : "warning",
        description: "Percentage of AI decisions with an assigned accountable owner.",
      },
      {
        id: "human-review-coverage",
        title: "Human Review Coverage",
        value: `${Math.round(humanReviewCoverage * 100)}%`,
        signalLevel: humanReviewCoverage >= 0.9 ? "positive" : "warning",
        description: "Percentage of AI decisions reviewed by a human.",
      },
      {
        id: "critical-risk-decisions",
        title: "Critical Risk Decisions",
        value: String(metrics.criticalRiskDecisions),
        signalLevel: metrics.criticalRiskDecisions > 0 ? "critical" : "positive",
        description: "Number of AI decisions classified as critical risk.",
      },
      {
        id: "overdue-remediations",
        title: "Overdue Remediations",
        value: String(metrics.overdueRemediations),
        signalLevel: metrics.overdueRemediations > 0 ? "critical" : "positive",
        description: "Remediation plans with overdue corrective or preventive actions.",
      },
      {
        id: "average-impact-score",
        title: "Average Impact Score",
        value: metrics.averageImpactScore.toFixed(2),
        signalLevel:
          metrics.averageImpactScore >= 4
            ? "critical"
            : metrics.averageImpactScore >= 3
              ? "warning"
              : "neutral",
        description: "Average calculated impact score across assessed decisions.",
      },
    ],
    generatedAt: now,
  };
}