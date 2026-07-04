import {
  EnterpriseRiskLikelihood,
  EnterpriseRiskSeverity,
} from "./riskTypes";

export interface EnterpriseRiskMatrixCell {
  severity: EnterpriseRiskSeverity;
  likelihood: EnterpriseRiskLikelihood;
  score: number;
}

const severityValues: Record<EnterpriseRiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const likelihoodValues: Record<EnterpriseRiskLikelihood, number> = {
  rare: 1,
  unlikely: 2,
  possible: 3,
  likely: 4,
  almostCertain: 5,
};

export function createEnterpriseRiskMatrix(): EnterpriseRiskMatrixCell[] {
  const cells: EnterpriseRiskMatrixCell[] = [];

  (Object.keys(severityValues) as EnterpriseRiskSeverity[]).forEach(
    (severity) => {
      (Object.keys(
        likelihoodValues,
      ) as EnterpriseRiskLikelihood[]).forEach((likelihood) => {
        cells.push({
          severity,
          likelihood,
          score:
            severityValues[severity] *
            likelihoodValues[likelihood],
        });
      });
    },
  );

  return cells;
}