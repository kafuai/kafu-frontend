import {
  AIExecutionDecisionAuditMetadata,
  AIExecutionDecisionPriority,
  AIExecutionDecisionSignalType,
} from "./aiExecutionDecisionIntelligenceTypes";

export interface AIExecutionDecisionSignal {
  id: string;
  type: AIExecutionDecisionSignalType;
  title: string;
  description: string;
  confidence: number;
  urgency: number;
  priority: AIExecutionDecisionPriority;
  metadata: AIExecutionDecisionAuditMetadata;
}

export interface CreateAIExecutionDecisionSignalInput {
  id: string;
  type: AIExecutionDecisionSignalType;
  title: string;
  description: string;
  confidence: number;
  urgency: number;
  priority?: AIExecutionDecisionPriority;
  metadata: AIExecutionDecisionAuditMetadata;
}

export function createAIExecutionDecisionSignal(
  input: CreateAIExecutionDecisionSignalInput,
): AIExecutionDecisionSignal {
  const priority =
    input.priority ??
    inferAIExecutionDecisionPriority(input.confidence, input.urgency);

  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description: input.description,
    confidence: normalizeAIExecutionDecisionValue(input.confidence),
    urgency: normalizeAIExecutionDecisionValue(input.urgency),
    priority,
    metadata: input.metadata,
  };
}

export function inferAIExecutionDecisionPriority(
  confidence: number,
  urgency: number,
): AIExecutionDecisionPriority {
  const score =
    normalizeAIExecutionDecisionValue(confidence) * 0.45 +
    normalizeAIExecutionDecisionValue(urgency) * 0.55;

  if (score >= 0.9) return "critical";
  if (score >= 0.72) return "high";
  if (score >= 0.45) return "medium";

  return "low";
}

export function normalizeAIExecutionDecisionValue(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}