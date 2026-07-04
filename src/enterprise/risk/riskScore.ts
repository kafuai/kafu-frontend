import {
  EnterpriseRisk,
  RiskLikelihood,
  RiskSeverity,
} from "./riskTypes";

const severityScore: Record<RiskSeverity, number> = {
  low: 10,
  medium: 30,
  high: 60,
  critical: 90,
};

const likelihoodScore: Record<RiskLikelihood, number> = {
  rare: 10,
  unlikely: 25,
  possible: 45,
  likely: 70,
  almost_certain: 90,
};

export type RiskScoreResult = {
  riskId: string;
  severityScore: number;
  likelihoodScore: number;
  impactScore: number;
  signalScore: number;
  totalScore: number;
  calculatedAt: string;
};

export function calculateRiskScore(risk: EnterpriseRisk): RiskScoreResult {
  const severity = severityScore[risk.severity];
  const likelihood = likelihoodScore[risk.likelihood];

  const impactScore =
    risk.impacts.length === 0
      ? 0
      : Math.min(
          100,
          risk.impacts.reduce((total, impact) => {
            return total + severityScore[impact.severity];
          }, 0) / risk.impacts.length,
        );

  const signalScore =
    risk.signals.length === 0
      ? 0
      : Math.min(
          100,
          risk.signals.reduce((total, signal) => {
            return total + signal.confidence * 100;
          }, 0) / risk.signals.length,
        );

  const totalScore = Math.round(
    severity * 0.35 +
      likelihood * 0.25 +
      impactScore * 0.25 +
      signalScore * 0.15,
  );

  return {
    riskId: risk.id,
    severityScore: severity,
    likelihoodScore: likelihood,
    impactScore: Math.round(impactScore),
    signalScore: Math.round(signalScore),
    totalScore,
    calculatedAt: new Date().toISOString(),
  };
}