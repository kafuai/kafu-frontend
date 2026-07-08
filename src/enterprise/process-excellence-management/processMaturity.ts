import type { EnterpriseProcess, ProcessMaturityLevel } from "./processExcellenceTypes";

const maturityRank: Record<ProcessMaturityLevel, number> = {
  initial: 1,
  managed: 2,
  standardized: 3,
  optimized: 4,
  adaptive: 5,
};

export function calculateProcessMaturityScore(process: EnterpriseProcess): number {
  const maturityBase = maturityRank[process.maturity] * 20;
  const automationBonus = Math.min(process.automationCoverage * 0.25, 20);
  const defectPenalty = Math.min(process.defectRate * 2, 15);

  return Math.max(0, Math.round(maturityBase + automationBonus - defectPenalty));
}

export function classifyMaturity(score: number): ProcessMaturityLevel {
  if (score >= 90) return "adaptive";
  if (score >= 75) return "optimized";
  if (score >= 55) return "standardized";
  if (score >= 35) return "managed";
  return "initial";
}
