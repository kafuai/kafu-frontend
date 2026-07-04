import {
  EnterpriseRisk,
  RiskImpact,
  RiskLikelihood,
  RiskSeverity,
} from "./riskTypes";

export type RiskAssessmentInput = {
  risk: EnterpriseRisk;
  assessorId: string;
  notes?: string;
};

export type RiskAssessmentResult = {
  riskId: string;
  assessorId: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  impactCount: number;
  highestImpactSeverity: RiskSeverity;
  assessedAt: string;
  notes?: string;
};

const severityRank: Record<RiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function getHighestImpactSeverity(
  impacts: RiskImpact[],
): RiskSeverity {
  if (impacts.length === 0) {
    return "low";
  }

  return impacts.reduce<RiskSeverity>((highest, impact) => {
    return severityRank[impact.severity] > severityRank[highest]
      ? impact.severity
      : highest;
  }, "low");
}

export function assessEnterpriseRisk(
  input: RiskAssessmentInput,
): RiskAssessmentResult {
  return {
    riskId: input.risk.id,
    assessorId: input.assessorId,
    severity: input.risk.severity,
    likelihood: input.risk.likelihood,
    impactCount: input.risk.impacts.length,
    highestImpactSeverity: getHighestImpactSeverity(input.risk.impacts),
    assessedAt: new Date().toISOString(),
    notes: input.notes,
  };
}