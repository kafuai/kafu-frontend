import { EnterpriseRisk, RiskSeverity } from "./riskTypes";
import { calculateRiskScore } from "./riskScore";

export type RiskMonitoringThreshold = {
  severity?: RiskSeverity;
  score?: number;
  signalConfidence?: number;
};

export type RiskMonitoringResult = {
  riskId: string;
  breached: boolean;
  reasons: string[];
  monitoredAt: string;
};

const severityRank: Record<RiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function monitorRiskThreshold(
  risk: EnterpriseRisk,
  threshold: RiskMonitoringThreshold,
): RiskMonitoringResult {
  const reasons: string[] = [];
  const score = calculateRiskScore(risk);

  if (
    threshold.severity &&
    severityRank[risk.severity] >= severityRank[threshold.severity]
  ) {
    reasons.push(`Risk severity reached ${risk.severity}`);
  }

  if (threshold.score !== undefined && score.totalScore >= threshold.score) {
    reasons.push(`Risk score reached ${score.totalScore}`);
  }

  const maxSignalConfidence = Math.max(
    0,
    ...risk.signals.map((signal) => signal.confidence),
  );

  if (
    threshold.signalConfidence !== undefined &&
    maxSignalConfidence >= threshold.signalConfidence
  ) {
    reasons.push(`Signal confidence reached ${maxSignalConfidence}`);
  }

  return {
    riskId: risk.id,
    breached: reasons.length > 0,
    reasons,
    monitoredAt: new Date().toISOString(),
  };
}