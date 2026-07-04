import { AIExecutionMonitoringDriftAssessment } from "./aiExecutionMonitoringDrift";
import { AIExecutionMonitoringHealthAssessment } from "./aiExecutionMonitoringHealth";
import { AIExecutionMonitoringRiskAssessment } from "./aiExecutionMonitoringRisk";
import { AIExecutionMonitoringSlaAssessment } from "./aiExecutionMonitoringSla";
import { AIExecutionMonitoringSnapshot } from "./aiExecutionMonitoringSnapshot";
import { AIExecutionMonitoringSignal } from "./aiExecutionMonitoringSignal";

export interface AIExecutionMonitoringReport {
  executionId: string;
  snapshotId: string;
  status: AIExecutionMonitoringSnapshot["status"];
  trend: AIExecutionMonitoringSnapshot["trend"];
  progress: number;
  health?: AIExecutionMonitoringHealthAssessment;
  risk?: AIExecutionMonitoringRiskAssessment;
  drift?: AIExecutionMonitoringDriftAssessment;
  sla?: AIExecutionMonitoringSlaAssessment;
  signals: AIExecutionMonitoringSignal[];
  recommendations: string[];
  generatedAt: Date;
}

export interface CreateAIExecutionMonitoringReportInput {
  snapshot: AIExecutionMonitoringSnapshot;
  health?: AIExecutionMonitoringHealthAssessment;
  risk?: AIExecutionMonitoringRiskAssessment;
  drift?: AIExecutionMonitoringDriftAssessment;
  sla?: AIExecutionMonitoringSlaAssessment;
  additionalSignals?: AIExecutionMonitoringSignal[];
  generatedAt?: Date;
}

function uniqueRecommendations(recommendations: string[]): string[] {
  return Array.from(new Set(recommendations));
}

function createMonitoringRecommendations(
  input: CreateAIExecutionMonitoringReportInput,
): string[] {
  const recommendations: string[] = [];

  if (input.health && input.health.status !== "healthy") {
    recommendations.push("Review execution health metrics and unblock degraded areas.");
  }

  if (input.risk && input.risk.severity !== "info") {
    recommendations.push("Prioritize risk drivers before continuing autonomous execution.");
  }

  if (input.drift && input.drift.severity !== "info") {
    recommendations.push("Compare drifted metrics against the execution baseline.");
  }

  if (input.sla && input.sla.status !== "within_sla") {
    recommendations.push("Escalate SLA risk and adjust execution timing or scope.");
  }

  if (input.snapshot.progress < 50 && input.snapshot.status !== "healthy") {
    recommendations.push("Increase monitoring frequency until execution stabilizes.");
  }

  return uniqueRecommendations(recommendations);
}

export function createAIExecutionMonitoringReport(
  input: CreateAIExecutionMonitoringReportInput,
): AIExecutionMonitoringReport {
  const signals = [
    ...input.snapshot.signals,
    ...(input.health?.signals ?? []),
    ...(input.risk?.signals ?? []),
    ...(input.drift?.signals ?? []),
    ...(input.sla?.signals ?? []),
    ...(input.additionalSignals ?? []),
  ];

  return {
    executionId: input.snapshot.context.executionId,
    snapshotId: input.snapshot.id,
    status: input.snapshot.status,
    trend: input.snapshot.trend,
    progress: input.snapshot.progress,
    health: input.health,
    risk: input.risk,
    drift: input.drift,
    sla: input.sla,
    signals,
    recommendations: createMonitoringRecommendations(input),
    generatedAt: input.generatedAt ?? new Date(),
  };
}

export function hasCriticalAIExecutionMonitoringReport(
  report: AIExecutionMonitoringReport,
): boolean {
  return report.signals.some(
    (signal) => signal.severity === "critical" && signal.confidence >= 0.7,
  );
}