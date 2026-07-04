import { AIExecutionPredictionScenario } from "./aiExecutionPredictionScenario";
import { AIExecutionPredictionSignal } from "./aiExecutionPredictionSignal";
import {
  AIExecutionPredictionAuditMetadata,
  AIExecutionPredictionScore,
} from "./aiExecutionPredictionTypes";
import {
  AIExecutionPredictionPolicy,
  applyAIExecutionPredictionPolicy,
} from "./aiExecutionPredictionPolicy";
import { selectBestAIExecutionPredictionScenario } from "./aiExecutionPredictionSelector";

export interface AIExecutionPredictionInput {
  signal: AIExecutionPredictionSignal;
  scenarios: AIExecutionPredictionScenario[];
  policy: AIExecutionPredictionPolicy;
  metadata: AIExecutionPredictionAuditMetadata;
}

export interface AIExecutionPredictionResult {
  signal: AIExecutionPredictionSignal;
  selectedScenario?: AIExecutionPredictionScenario;
  selectedScore?: AIExecutionPredictionScore;
  acceptedScenarios: AIExecutionPredictionScenario[];
  rejectedScenarios: AIExecutionPredictionScenario[];
  rationale: string;
  metadata: AIExecutionPredictionAuditMetadata;
}

export function runAIExecutionPrediction(
  input: AIExecutionPredictionInput,
): AIExecutionPredictionResult {
  const policyEvaluation = applyAIExecutionPredictionPolicy(
    input.scenarios,
    input.policy,
  );

  const selection = selectBestAIExecutionPredictionScenario(
    policyEvaluation.accepted,
  );

  return {
    signal: input.signal,
    selectedScenario: selection.selectedScenario,
    selectedScore: selection.selectedScore,
    acceptedScenarios: selection.eligibleScenarios,
    rejectedScenarios: [
      ...policyEvaluation.rejected,
      ...selection.rejectedScenarios,
    ],
    rationale: selection.rationale,
    metadata: input.metadata,
  };
}