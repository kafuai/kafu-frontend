export interface EnterpriseRiskThreshold {
  thresholdId: string;
  riskId: string;
  warningThreshold: number;
  criticalThreshold: number;
}

export function isRiskWarning(
  value: number,
  threshold: EnterpriseRiskThreshold,
): boolean {
  return value >= threshold.warningThreshold;
}

export function isRiskCritical(
  value: number,
  threshold: EnterpriseRiskThreshold,
): boolean {
  return value >= threshold.criticalThreshold;
}