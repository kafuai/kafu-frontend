import { AIExecutionReasoningContext } from "./aiExecutionReasoningContext";
import {
  AIExecutionReasoningAssumption,
  AIExecutionReasoningConstraint,
  AIExecutionReasoningEvidence,
  AIExecutionReasoningSignal,
} from "./aiExecutionReasoningTypes";

export interface AIExecutionReasoningInput {
  id: string;
  context: AIExecutionReasoningContext;
  question: string;
  evidence: AIExecutionReasoningEvidence[];
  constraints: AIExecutionReasoningConstraint[];
  assumptions: AIExecutionReasoningAssumption[];
  signals: AIExecutionReasoningSignal[];
  requestedAt: Date;
}

export interface AIExecutionReasoningInputOptions {
  id: string;
  context: AIExecutionReasoningContext;
  question: string;
  evidence?: AIExecutionReasoningEvidence[];
  constraints?: AIExecutionReasoningConstraint[];
  assumptions?: AIExecutionReasoningAssumption[];
  signals?: AIExecutionReasoningSignal[];
}

export function createAIExecutionReasoningInput(
  options: AIExecutionReasoningInputOptions,
): AIExecutionReasoningInput {
  return {
    id: options.id,
    context: options.context,
    question: options.question,
    evidence: [...options.context.evidence, ...(options.evidence ?? [])],
    constraints: [...options.context.constraints, ...(options.constraints ?? [])],
    assumptions: [...options.context.assumptions, ...(options.assumptions ?? [])],
    signals: [...options.context.signals, ...(options.signals ?? [])],
    requestedAt: new Date(),
  };
}

export function isAIExecutionReasoningInputActionable(
  input: AIExecutionReasoningInput,
): boolean {
  return input.question.trim().length > 0 && input.evidence.length + input.assumptions.length > 0;
}

export function summarizeAIExecutionReasoningInput(
  input: AIExecutionReasoningInput,
): string {
  return [
    `Reasoning input ${input.id}`,
    `Objective: ${input.context.objective}`,
    `Question: ${input.question}`,
    `Evidence: ${input.evidence.length}`,
    `Constraints: ${input.constraints.length}`,
    `Assumptions: ${input.assumptions.length}`,
    `Signals: ${input.signals.length}`,
  ].join(" | ");
}