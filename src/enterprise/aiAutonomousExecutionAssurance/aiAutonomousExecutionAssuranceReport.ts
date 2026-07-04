import { AIAutonomousExecutionAssuranceResult } from "./aiAutonomousExecutionAssuranceTypes";

export interface AIAutonomousExecutionAssuranceReport {
  summary: string;
  approved: boolean;
  result: AIAutonomousExecutionAssuranceResult;
}

export function createExecutionAssuranceReport(
  result: AIAutonomousExecutionAssuranceResult,
): AIAutonomousExecutionAssuranceReport {
  return {
    approved: result.status === "assured",
    summary: `${result.status.toUpperCase()} | Score ${result.assuranceScore.toFixed(
      2,
    )} | Level ${result.level}`,
    result,
  };
}