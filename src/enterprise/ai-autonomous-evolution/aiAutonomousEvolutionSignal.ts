import {
  AIAutonomousEvolutionPriority,
  AIAutonomousEvolutionSignalType,
} from "./aiAutonomousEvolutionTypes";

export interface AIAutonomousEvolutionSignal {
  id: string;
  organizationId: string;
  type: AIAutonomousEvolutionSignalType;
  source: string;
  title: string;
  description: string;
  confidence: number;
  priority: AIAutonomousEvolutionPriority;
  evidenceIds: string[];
  observedAt: Date;
}

export interface CreateAIAutonomousEvolutionSignalInput {
  id: string;
  organizationId: string;
  type: AIAutonomousEvolutionSignalType;
  source: string;
  title: string;
  description: string;
  confidence?: number;
  priority?: AIAutonomousEvolutionPriority;
  evidenceIds?: string[];
  observedAt?: Date;
}

export function createAIAutonomousEvolutionSignal(
  input: CreateAIAutonomousEvolutionSignalInput,
): AIAutonomousEvolutionSignal {
  return {
    id: input.id,
    organizationId: input.organizationId,
    type: input.type,
    source: input.source,
    title: input.title,
    description: input.description,
    confidence: input.confidence ?? 0.7,
    priority: input.priority ?? "medium",
    evidenceIds: input.evidenceIds ?? [],
    observedAt: input.observedAt ?? new Date(),
  };
}

export function isHighConfidenceAIAutonomousEvolutionSignal(
  signal: AIAutonomousEvolutionSignal,
  minimumConfidence = 0.75,
): boolean {
  return signal.confidence >= minimumConfidence;
}