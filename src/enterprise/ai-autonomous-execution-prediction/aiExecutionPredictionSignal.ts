import {
  AIExecutionPredictionAuditMetadata,
  AIExecutionPredictionPriority,
  AIExecutionPredictionSignalType,
} from "./aiExecutionPredictionTypes";

export interface AIExecutionPredictionSignal {
  id: string;
  type: AIExecutionPredictionSignalType;
  title: string;
  description: string;
  confidence: number;
  intensity: number;
  priority: AIExecutionPredictionPriority;
  metadata: AIExecutionPredictionAuditMetadata;
}

export interface CreateAIExecutionPredictionSignalInput {
  id: string;
  type: AIExecutionPredictionSignalType;
  title: string;
  description: string;
  confidence: number;
  intensity: number;
  priority?: AIExecutionPredictionPriority;
  metadata: AIExecutionPredictionAuditMetadata;
}

export function createAIExecutionPredictionSignal(
  input: CreateAIExecutionPredictionSignalInput,
): AIExecutionPredictionSignal {
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description: input.description,
    confidence: normalizeAIExecutionPredictionValue(input.confidence),
    intensity: normalizeAIExecutionPredictionValue(input.intensity),
    priority:
      input.priority ??
      inferAIExecutionPredictionPriority(input.confidence, input.intensity),
    metadata: input.metadata,
  };
}

export function inferAIExecutionPredictionPriority(
  confidence: number,
  intensity: number,
): AIExecutionPredictionPriority {
  const score =
    normalizeAIExecutionPredictionValue(confidence) * 0.5 +
    normalizeAIExecutionPredictionValue(intensity) * 0.5;

  if (score >= 0.9) return "critical";
  if (score >= 0.72) return "high";
  if (score >= 0.45) return "medium";

  return "low";
}

export function normalizeAIExecutionPredictionValue(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}