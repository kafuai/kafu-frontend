import { ArchitectureAssessment } from "./architectureAssessment";
import { ArchitectureGovernanceResult } from "./architectureGovernance";

export interface ArchitectureReport {
  generatedAt: string;
  assessment: ArchitectureAssessment;
  governance: ArchitectureGovernanceResult;
}

export function generateArchitectureReport(
  assessment: ArchitectureAssessment,
  governance: ArchitectureGovernanceResult,
): ArchitectureReport {
  return {
    generatedAt: new Date().toISOString(),
    assessment,
    governance,
  };
}