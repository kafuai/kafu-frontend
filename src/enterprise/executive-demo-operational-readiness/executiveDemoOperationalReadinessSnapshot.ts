import {
  ExecutiveOperationalReadinessInput,
  ExecutiveOperationalReadinessResult,
} from "./executiveDemoOperationalReadinessTypes";

export interface ExecutiveOperationalReadinessSnapshot {
  organizationId: string;
  generatedAt: string;
  overallScore: number;
  readinessLevel: ExecutiveOperationalReadinessResult["readinessLevel"];
  scoreBreakdown: {
    readiness: number;
    governance: number;
    execution: number;
    intelligence: number;
  };
}

export function buildExecutiveOperationalReadinessSnapshot(
  input: ExecutiveOperationalReadinessInput,
  result: ExecutiveOperationalReadinessResult,
): ExecutiveOperationalReadinessSnapshot {
  return {
    organizationId: input.organizationId,
    generatedAt: new Date().toISOString(),
    overallScore: result.overallScore,
    readinessLevel: result.readinessLevel,
    scoreBreakdown: {
      readiness: input.readinessScore,
      governance: input.governanceScore,
      execution: input.executionScore,
      intelligence: input.intelligenceScore,
    },
  };
}
