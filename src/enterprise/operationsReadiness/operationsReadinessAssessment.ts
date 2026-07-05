export type OperationsReadinessLevel =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "optimized";

export type OperationsReadinessSignalStatus =
  | "healthy"
  | "warning"
  | "critical";

export interface OperationsReadinessSignal {
  readonly id: string;
  readonly name: string;
  readonly status: OperationsReadinessSignalStatus;
  readonly score: number;
  readonly evidence: readonly string[];
}

export interface OperationsReadinessAssessment {
  readonly id: string;
  readonly assessedAt: string;
  readonly assessedBy: string;
  readonly level: OperationsReadinessLevel;
  readonly overallScore: number;
  readonly signals: readonly OperationsReadinessSignal[];
  readonly blockers: readonly string[];
  readonly recommendations: readonly string[];
}

export function calculateOperationsReadinessScore(
  signals: readonly OperationsReadinessSignal[],
): number {
  if (signals.length === 0) {
    return 0;
  }

  const totalScore = signals.reduce((sum, signal) => sum + signal.score, 0);
  return Math.round(totalScore / signals.length);
}

export function determineOperationsReadinessLevel(
  score: number,
): OperationsReadinessLevel {
  if (score >= 90) {
    return "optimized";
  }

  if (score >= 75) {
    return "ready";
  }

  if (score >= 50) {
    return "partially_ready";
  }

  return "not_ready";
}

export function hasCriticalOperationsReadinessSignal(
  assessment: OperationsReadinessAssessment,
): boolean {
  return assessment.signals.some((signal) => signal.status === "critical");
}