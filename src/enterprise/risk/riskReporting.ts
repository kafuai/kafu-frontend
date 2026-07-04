import { EnterpriseRisk, RiskCategory, RiskSeverity } from "./riskTypes";
import { calculateRiskScore } from "./riskScore";

export type RiskReportSummary = {
  organizationId: string;
  totalRisks: number;
  openRisks: number;
  criticalRisks: number;
  averageScore: number;
  risksByCategory: Record<RiskCategory, number>;
  risksBySeverity: Record<RiskSeverity, number>;
  generatedAt: string;
};

const emptyCategoryCounts: Record<RiskCategory, number> = {
  strategic: 0,
  operational: 0,
  financial: 0,
  compliance: 0,
  security: 0,
  technology: 0,
  reputation: 0,
  vendor: 0,
  environmental: 0,
  custom: 0,
};

const emptySeverityCounts: Record<RiskSeverity, number> = {
  low: 0,
  medium: 0,
  high: 0,
  critical: 0,
};

export function generateRiskReportSummary(
  organizationId: string,
  risks: EnterpriseRisk[],
): RiskReportSummary {
  const scopedRisks = risks.filter(
    (risk) => risk.organizationId === organizationId,
  );

  const scores = scopedRisks.map((risk) => calculateRiskScore(risk).totalScore);

  const averageScore =
    scores.length === 0
      ? 0
      : Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);

  return {
    organizationId,
    totalRisks: scopedRisks.length,
    openRisks: scopedRisks.filter((risk) => risk.status !== "closed").length,
    criticalRisks: scopedRisks.filter((risk) => risk.severity === "critical").length,
    averageScore,
    risksByCategory: scopedRisks.reduce<Record<RiskCategory, number>>(
      (counts, risk) => ({
        ...counts,
        [risk.category]: counts[risk.category] + 1,
      }),
      { ...emptyCategoryCounts },
    ),
    risksBySeverity: scopedRisks.reduce<Record<RiskSeverity, number>>(
      (counts, risk) => ({
        ...counts,
        [risk.severity]: counts[risk.severity] + 1,
      }),
      { ...emptySeverityCounts },
    ),
    generatedAt: new Date().toISOString(),
  };
}