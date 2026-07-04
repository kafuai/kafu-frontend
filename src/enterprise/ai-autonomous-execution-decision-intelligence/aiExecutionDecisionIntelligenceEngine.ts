import { AIExecutionDecisionOption } from "./aiExecutionDecisionOption";
import { AIExecutionDecisionSignal } from "./aiExecutionDecisionSignal";
import {
  AIExecutionDecisionAuditMetadata,
  AIExecutionDecisionScore,
} from "./aiExecutionDecisionIntelligenceTypes";
import {
  AIExecutionDecisionPolicy,
  applyAIExecutionDecisionPolicy,
} from "./aiExecutionDecisionPolicy";
import { selectBestAIExecutionDecisionOption } from "./aiExecutionDecisionSelector";

export interface AIExecutionDecisionIntelligenceInput {
  signal: AIExecutionDecisionSignal;
  options: AIExecutionDecisionOption[];
  policy: AIExecutionDecisionPolicy;
  metadata: AIExecutionDecisionAuditMetadata;
}

export interface AIExecutionDecisionIntelligenceResult {
  signal: AIExecutionDecisionSignal;
  selectedOption?: AIExecutionDecisionOption;
  selectedScore?: AIExecutionDecisionScore;
  acceptedOptions: AIExecutionDecisionOption[];
  rejectedOptions: AIExecutionDecisionOption[];
  rationale: string;
  metadata: AIExecutionDecisionAuditMetadata;
}

export function runAIExecutionDecisionIntelligence(
  input: AIExecutionDecisionIntelligenceInput,
): AIExecutionDecisionIntelligenceResult {
  const policyEvaluation = applyAIExecutionDecisionPolicy(
    input.options,
    input.policy,
  );

  const selection = selectBestAIExecutionDecisionOption(
    policyEvaluation.accepted,
  );

  return {
    signal: input.signal,
    selectedOption: selection.selectedOption,
    selectedScore: selection.selectedScore,
    acceptedOptions: selection.eligibleOptions,
    rejectedOptions: [
      ...policyEvaluation.rejected,
      ...selection.rejectedOptions,
    ],
    rationale: selection.rationale,
    metadata: input.metadata,
  };
}