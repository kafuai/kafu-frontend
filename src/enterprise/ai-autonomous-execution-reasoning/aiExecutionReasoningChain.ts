import { AIExecutionReasoningInput } from "./aiExecutionReasoningInput";
import {
  AIExecutionReasoningConfidenceLevel,
  AIExecutionReasoningEvidence,
} from "./aiExecutionReasoningTypes";

export interface AIExecutionReasoningStep {
  id: string;
  title: string;
  explanation: string;
  evidence: AIExecutionReasoningEvidence[];
}

export interface AIExecutionReasoningChain {
  inputId: string;
  steps: AIExecutionReasoningStep[];
  confidence: AIExecutionReasoningConfidenceLevel;
  generatedAt: Date;
}

function resolveConfidence(score: number): AIExecutionReasoningConfidenceLevel {
  if (score >= 0.9) return "very_high";
  if (score >= 0.75) return "high";
  if (score >= 0.5) return "medium";
  if (score >= 0.25) return "low";
  return "very_low";
}

export function createAIExecutionReasoningChain(
  input: AIExecutionReasoningInput,
): AIExecutionReasoningChain {
  const average =
    input.evidence.length === 0
      ? 0
      : input.evidence.reduce((sum, item) => sum + item.confidence, 0) /
        input.evidence.length;

  return {
    inputId: input.id,
    confidence: resolveConfidence(average),
    generatedAt: new Date(),
    steps: [
      {
        id: "collect",
        title: "Collect Evidence",
        explanation: "Collected available evidence and assumptions.",
        evidence: input.evidence,
      },
      {
        id: "reason",
        title: "Reason",
        explanation: input.question,
        evidence: input.evidence,
      },
    ],
  };
}