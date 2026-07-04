import {
  AIExecutionReasoningAssumption,
  AIExecutionReasoningConstraint,
  AIExecutionReasoningEvidence,
  AIExecutionReasoningMode,
  AIExecutionReasoningPriority,
  AIExecutionReasoningSignal,
} from "./aiExecutionReasoningTypes";

export interface AIExecutionReasoningContext {
  executionId: string;
  tenantId?: string;
  objective: string;
  reasoningModes: AIExecutionReasoningMode[];
  priority: AIExecutionReasoningPriority;
  evidence: AIExecutionReasoningEvidence[];
  constraints: AIExecutionReasoningConstraint[];
  assumptions: AIExecutionReasoningAssumption[];
  signals: AIExecutionReasoningSignal[];
  createdAt: Date;
}

export interface AIExecutionReasoningContextInput {
  executionId: string;
  tenantId?: string;
  objective: string;
  reasoningModes?: AIExecutionReasoningMode[];
  priority?: AIExecutionReasoningPriority;
  evidence?: AIExecutionReasoningEvidence[];
  constraints?: AIExecutionReasoningConstraint[];
  assumptions?: AIExecutionReasoningAssumption[];
  signals?: AIExecutionReasoningSignal[];
}

export function createAIExecutionReasoningContext(
  input: AIExecutionReasoningContextInput,
): AIExecutionReasoningContext {
  return {
    executionId: input.executionId,
    tenantId: input.tenantId,
    objective: input.objective,
    reasoningModes:
      input.reasoningModes && input.reasoningModes.length > 0
        ? input.reasoningModes
        : ["deductive", "causal", "risk_aware"],
    priority: input.priority ?? "medium",
    evidence: input.evidence ?? [],
    constraints: input.constraints ?? [],
    assumptions: input.assumptions ?? [],
    signals: input.signals ?? [],
    createdAt: new Date(),
  };
}

export function hasCriticalAIExecutionReasoningConstraint(
  context: AIExecutionReasoningContext,
): boolean {
  return context.constraints.some(
    (constraint) => constraint.required && constraint.severity === "critical",
  );
}

export function hasHighConfidenceAIExecutionReasoningEvidence(
  context: AIExecutionReasoningContext,
  minimumConfidence = 0.75,
): boolean {
  return context.evidence.some(
    (evidence) =>
      evidence.confidence >= minimumConfidence && evidence.relevance >= minimumConfidence,
  );
}