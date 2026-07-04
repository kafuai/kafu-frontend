import { AIInnovationSignalSource } from "./aiAutonomousInnovationTypes";

export interface AIInnovationSignal {
  id: string;
  organizationId: string;
  source: AIInnovationSignalSource;
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  urgency: number;
  detectedAt: Date;
  relatedCapabilityIds: string[];
  relatedEvolutionIds: string[];
}

export interface CreateAIInnovationSignalInput {
  id: string;
  organizationId: string;
  source: AIInnovationSignalSource;
  title: string;
  description: string;
  evidence?: string[];
  confidence?: number;
  urgency?: number;
  detectedAt?: Date;
  relatedCapabilityIds?: string[];
  relatedEvolutionIds?: string[];
}

function normalizeScore(value: number | undefined, fallback: number): number {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(1, Math.max(0, value));
}

export function createAIInnovationSignal(
  input: CreateAIInnovationSignalInput,
): AIInnovationSignal {
  return {
    id: input.id,
    organizationId: input.organizationId,
    source: input.source,
    title: input.title.trim(),
    description: input.description.trim(),
    evidence: input.evidence ?? [],
    confidence: normalizeScore(input.confidence, 0.5),
    urgency: normalizeScore(input.urgency, 0.5),
    detectedAt: input.detectedAt ?? new Date(),
    relatedCapabilityIds: input.relatedCapabilityIds ?? [],
    relatedEvolutionIds: input.relatedEvolutionIds ?? [],
  };
}

export function isHighValueInnovationSignal(signal: AIInnovationSignal): boolean {
  return signal.confidence >= 0.7 && signal.urgency >= 0.6 && signal.evidence.length > 0;
}