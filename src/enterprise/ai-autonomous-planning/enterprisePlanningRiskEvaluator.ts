import { EnterprisePlanningRisk } from "./enterpriseAIPlanningEngineTypes";

export function calculateEnterprisePlanningRiskScore(
  risks: EnterprisePlanningRisk[]
): number {
  if (risks.length === 0) {
    return 0;
  }

  const totalRisk = risks.reduce((sum, risk) => {
    return sum + risk.probability * risk.impact;
  }, 0);

  return Number((totalRisk / risks.length).toFixed(2));
}

export function hasBlockingEnterprisePlanningRisk(
  risks: EnterprisePlanningRisk[]
): boolean {
  return risks.some((risk) => risk.probability >= 0.8 && risk.impact >= 0.8);
}