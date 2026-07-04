import { AIExecutionAdaptationSignal } from "./aiExecutionAdaptationSignal";
import {
  AIExecutionAdaptationAction,
  AIExecutionAdaptationConfidence,
} from "./aiExecutionAdaptationTypes";
import {
  AIExecutionAdaptationPolicy,
  resolveAIExecutionAdaptationPolicyAction,
} from "./aiExecutionAdaptationPolicy";

export interface AIExecutionAdaptationDecision {
  executionId: string;
  action: AIExecutionAdaptationAction;
  confidence: AIExecutionAdaptationConfidence;
  rationale: string;
  createdAt: Date;
}

function resolveConfidence(score: number): AIExecutionAdaptationConfidence {
  if (score >= 0.85) {
    return "high";
  }

  if (score >= 0.6) {
    return "medium";
  }

  return "low";
}

export function createAIExecutionAdaptationDecision(
  signal: AIExecutionAdaptationSignal,
  policy: AIExecutionAdaptationPolicy,
): AIExecutionAdaptationDecision {
  return {
    executionId: signal.executionId,
    action: resolveAIExecutionAdaptationPolicyAction(signal, policy),
    confidence: resolveConfidence(signal.confidenceScore),
    rationale: signal.reason,
    createdAt: new Date(),
  };
}