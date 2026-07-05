import type { OperationsReadinessAssessment } from "./operationsReadinessAssessment";

export interface OperationsReadinessReviewFinding {
  readonly id: string;
  readonly assessmentId: string;
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly description: string;
  readonly recommendedAction: string;
}

export function createOperationsReadinessReviewFindings(
  assessment: OperationsReadinessAssessment,
): readonly OperationsReadinessReviewFinding[] {
  const findings: OperationsReadinessReviewFinding[] = [];

  for (const signal of assessment.signals) {
    if (signal.status === "warning" || signal.status === "critical") {
      findings.push({
        id: `${assessment.id}:${signal.id}`,
        assessmentId: assessment.id,
        severity: signal.status === "critical" ? "critical" : "medium",
        description: `Readiness signal "${signal.name}" requires attention.`,
        recommendedAction:
          signal.evidence.length > 0
            ? signal.evidence.join(" ")
            : "Review operational readiness evidence and define corrective action.",
      });
    }
  }

  for (const blocker of assessment.blockers) {
    findings.push({
      id: `${assessment.id}:blocker:${findings.length + 1}`,
      assessmentId: assessment.id,
      severity: "high",
      description: blocker,
      recommendedAction: "Resolve blocker before approving operational readiness.",
    });
  }

  return findings;
}