import {
  AIExecutionComplianceAssessment,
  AIExecutionComplianceEvidence,
} from "./aiAutonomousExecutionComplianceTypes";
import {
  AIExecutionCompliancePolicyConfig,
  createDefaultAIExecutionCompliancePolicy,
} from "./aiExecutionCompliancePolicy";
import { evaluateAIExecutionCompliance } from "./aiExecutionComplianceEvaluator";
import {
  AIExecutionComplianceGateDecision,
  evaluateAIExecutionComplianceGate,
} from "./aiExecutionComplianceGate";
import {
  AIExecutionComplianceReport,
  createAIExecutionComplianceReport,
} from "./aiExecutionComplianceReporter";

export interface AIExecutionCompliancePipelineInput {
  executionId: string;
  evidence: AIExecutionComplianceEvidence[];
  policy?: AIExecutionCompliancePolicyConfig;
  minimumScore?: number;
}

export interface AIExecutionCompliancePipelineResult {
  assessment: AIExecutionComplianceAssessment;
  report: AIExecutionComplianceReport;
  gateDecision: AIExecutionComplianceGateDecision;
}

export function runAIExecutionCompliancePipeline(
  input: AIExecutionCompliancePipelineInput
): AIExecutionCompliancePipelineResult {
  const policy = input.policy ?? createDefaultAIExecutionCompliancePolicy();

  const assessment = evaluateAIExecutionCompliance({
    executionId: input.executionId,
    policy,
    evidence: input.evidence,
  });

  const report = createAIExecutionComplianceReport(assessment);

  const gateDecision = evaluateAIExecutionComplianceGate(
    assessment,
    input.minimumScore
  );

  return {
    assessment,
    report,
    gateDecision,
  };
}