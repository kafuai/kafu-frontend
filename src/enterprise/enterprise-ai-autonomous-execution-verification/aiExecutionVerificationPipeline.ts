import {
  AIExecutionVerificationInput,
  AIExecutionVerificationResult,
} from "./aiExecutionVerificationTypes";
import { filterReliableAIExecutionVerificationEvidence } from "./aiExecutionVerificationEvidence";
import { scoreAIExecutionVerification } from "./aiExecutionVerificationScoring";
import { createAIExecutionVerificationDecision } from "./aiExecutionVerificationDecision";
import {
  AIExecutionVerificationReport,
  createAIExecutionVerificationReport,
} from "./aiExecutionVerificationReport";

export interface AIExecutionVerificationPipelineOutput {
  result: AIExecutionVerificationResult;
  report: AIExecutionVerificationReport;
}

export function runAIExecutionVerificationPipeline(
  input: AIExecutionVerificationInput
): AIExecutionVerificationPipelineOutput {
  const findings = input.findings ?? [];
  const reliableEvidence = filterReliableAIExecutionVerificationEvidence(
    input.evidence
  );

  const score = scoreAIExecutionVerification(input.evidence, findings);

  const result = createAIExecutionVerificationDecision(
    input.executionId,
    input.validationId,
    score,
    findings,
    reliableEvidence.length
  );

  return {
    result,
    report: createAIExecutionVerificationReport(
      result,
      input.evidence,
      findings
    ),
  };
}