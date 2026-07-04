import {
  AIObservabilityMetadata,
  AIObservabilitySeverity,
  AIObservabilitySignal,
  AIObservabilitySignalType,
  AIObservabilityStatus,
} from "./aiObservabilityTypes";

export interface CreateAIObservabilitySignalInput {
  id: string;
  type: AIObservabilitySignalType;
  severity: AIObservabilitySeverity;
  status: AIObservabilityStatus;
  message: string;
  metadata: AIObservabilityMetadata;
  value?: number;
  unit?: string;
  tags?: string[];
  createdAt?: Date;
}

export function createAIObservabilitySignal(
  input: CreateAIObservabilitySignalInput,
): AIObservabilitySignal {
  return {
    id: input.id,
    type: input.type,
    severity: input.severity,
    status: input.status,
    message: input.message,
    metadata: input.metadata,
    value: input.value,
    unit: input.unit,
    tags: input.tags ?? [],
    createdAt: input.createdAt ?? new Date(),
  };
}