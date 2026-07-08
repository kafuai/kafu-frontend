import type { EnterpriseProcess } from "./processExcellenceTypes";

export interface ProcessKpiSnapshot {
  processId: string;
  efficiencyScore: number;
  qualityScore: number;
  automationScore: number;
  overallScore: number;
}

export function calculateProcessKpis(process: EnterpriseProcess): ProcessKpiSnapshot {
  const efficiencyScore = Math.max(0, 100 - process.cycleTimeHours);
  const qualityScore = Math.max(0, 100 - process.defectRate * 10);
  const automationScore = Math.min(100, process.automationCoverage);

  return {
    processId: process.id,
    efficiencyScore,
    qualityScore,
    automationScore,
    overallScore: Math.round(
      efficiencyScore * 0.35 + qualityScore * 0.35 + automationScore * 0.3
    ),
  };
}

export function calculatePortfolioKpiScore(processes: EnterpriseProcess[]): number {
  if (processes.length === 0) return 0;

  const total = processes.reduce(
    (sum, process) => sum + calculateProcessKpis(process).overallScore,
    0
  );

  return Math.round(total / processes.length);
}
