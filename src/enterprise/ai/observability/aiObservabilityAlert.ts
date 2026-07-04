import {
  AIObservabilitySeverity,
  AIObservabilitySignal,
  AIObservabilitySignalType,
} from "./aiObservabilityTypes";

export type AIObservabilityAlertStatus = "open" | "acknowledged" | "resolved";

export interface AIObservabilityAlert {
  id: string;
  organizationId: string;
  environment: string;
  serviceName: string;
  type: AIObservabilitySignalType;
  severity: AIObservabilitySeverity;
  title: string;
  description: string;
  status: AIObservabilityAlertStatus;
  sourceSignalIds: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

export interface CreateAIObservabilityAlertInput {
  id: string;
  signal: AIObservabilitySignal;
  title: string;
  description: string;
  status?: AIObservabilityAlertStatus;
  createdAt?: Date;
}

export function createAIObservabilityAlert(
  input: CreateAIObservabilityAlertInput,
): AIObservabilityAlert {
  return {
    id: input.id,
    organizationId: input.signal.metadata.organizationId,
    environment: input.signal.metadata.environment,
    serviceName: input.signal.metadata.serviceName,
    type: input.signal.type,
    severity: input.signal.severity,
    title: input.title,
    description: input.description,
    status: input.status ?? "open",
    sourceSignalIds: [input.signal.id],
    createdAt: input.createdAt ?? new Date(),
  };
}