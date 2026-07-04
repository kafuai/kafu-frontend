import { EnterpriseRisk } from "./riskTypes";
import { calculateEnterpriseRiskScore, EnterpriseRiskScore } from "./riskScoring";

export interface EnterpriseRiskRegisterEntry {
  risk: EnterpriseRisk;
  score: EnterpriseRiskScore;
  createdAt: string;
  lastReviewedAt?: string;
}

export interface EnterpriseRiskRegisterSummary {
  totalRisks: number;
  openRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
}

export class EnterpriseRiskRegister {
  private readonly entries = new Map<string, EnterpriseRiskRegisterEntry>();

  registerRisk(risk: EnterpriseRisk): EnterpriseRiskRegisterEntry {
    const entry: EnterpriseRiskRegisterEntry = {
      risk,
      score: calculateEnterpriseRiskScore({
        severity: risk.severity,
        likelihood: risk.likelihood,
      }),
      createdAt: new Date().toISOString(),
    };

    this.entries.set(risk.riskId, entry);
    return entry;
  }

  getRisk(riskId: string): EnterpriseRiskRegisterEntry | undefined {
    return this.entries.get(riskId);
  }

  listRisks(): EnterpriseRiskRegisterEntry[] {
    return Array.from(this.entries.values());
  }

  updateRisk(risk: EnterpriseRisk): EnterpriseRiskRegisterEntry {
    const existing = this.entries.get(risk.riskId);

    const entry: EnterpriseRiskRegisterEntry = {
      risk,
      score: calculateEnterpriseRiskScore({
        severity: risk.severity,
        likelihood: risk.likelihood,
      }),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      lastReviewedAt: new Date().toISOString(),
    };

    this.entries.set(risk.riskId, entry);
    return entry;
  }

  summarize(): EnterpriseRiskRegisterSummary {
    const risks = this.listRisks();

    return {
      totalRisks: risks.length,
      openRisks: risks.filter((entry) => entry.risk.status !== "closed").length,
      criticalRisks: risks.filter((entry) => entry.score.rating === "critical").length,
      highRisks: risks.filter((entry) => entry.score.rating === "high").length,
      mediumRisks: risks.filter((entry) => entry.score.rating === "medium").length,
      lowRisks: risks.filter((entry) => entry.score.rating === "low").length,
    };
  }
}