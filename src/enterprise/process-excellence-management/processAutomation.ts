import type { EnterpriseProcess } from "./processExcellenceTypes";

export interface ProcessAutomationRecommendation {
  processId: string;
  recommendation: string;
  expectedBenefit: string;
  readinessScore: number;
}

export function recommendProcessAutomation(
  processes: EnterpriseProcess[]
): ProcessAutomationRecommendation[] {
  return processes
    .filter((process) => process.automationCoverage < 75)
    .map((process) => ({
      processId: process.id,
      recommendation: "Prioritize automation for repetitive approvals, validations, and handoffs.",
      expectedBenefit: "Higher throughput, lower manual effort, and more predictable execution.",
      readinessScore: Math.round(process.automationCoverage * 0.7 + 20),
    }));
}
