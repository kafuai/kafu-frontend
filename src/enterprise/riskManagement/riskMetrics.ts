import { EnterpriseRiskRegisterEntry } from "./riskRegister";

export interface EnterpriseRiskMetrics {
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
}

export function calculateEnterpriseRiskMetrics(
  risks: EnterpriseRiskRegisterEntry[],
): EnterpriseRiskMetrics {
  return {
    totalRisks: risks.length,
    criticalRisks: risks.filter(r => r.score.rating === "critical").length,
    highRisks: risks.filter(r => r.score.rating === "high").length,
    mediumRisks: risks.filter(r => r.score.rating === "medium").length,
    lowRisks: risks.filter(r => r.score.rating === "low").length,
  };
}