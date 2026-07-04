import {
  AIAutonomousExecutionAssuranceInput,
  AIAutonomousExecutionAssuranceResult,
} from "./aiAutonomousExecutionAssuranceTypes";
import { evaluateExecutionAssurance } from "./aiAutonomousExecutionAssuranceDecisionEngine";
import {
  createExecutionAssuranceReport,
  AIAutonomousExecutionAssuranceReport,
} from "./aiAutonomousExecutionAssuranceReport";
import { collectExecutionAssuranceEvidence } from "./aiAutonomousExecutionAssuranceEvidence";

export interface AIAutonomousExecutionAssurancePipelineResult {
  result: AIAutonomousExecutionAssuranceResult;
  report: AIAutonomousExecutionAssuranceReport;
  evidenceCount: number;
}

export function executeExecutionAssurancePipeline(
  input: AIAutonomousExecutionAssuranceInput,
): AIAutonomousExecutionAssurancePipelineResult {
  const evidence = collectExecutionAssuranceEvidence(input);
  const result = evaluateExecutionAssurance(input);
  const report = createExecutionAssuranceReport(result);

  return {
    result,
    report,
    evidenceCount: evidence.length,
  };
}