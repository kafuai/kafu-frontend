import {
  AIAutonomousEvolutionPriority,
  AIAutonomousEvolutionScope,
  AIAutonomousEvolutionStatus,
} from "./aiAutonomousEvolutionTypes";

export interface AIAutonomousEvolutionCandidate {
  id: string;
  organizationId: string;
  scope: AIAutonomousEvolutionScope;
  title: string;
  description: string;
  expectedBenefit: string;
  affectedCapabilities: string[];
  requiredSignals: string[];
  priority: AIAutonomousEvolutionPriority;
  status: AIAutonomousEvolutionStatus;
  proposedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAutonomousEvolutionCandidateInput {
  id: string;
  organizationId: string;
  scope: AIAutonomousEvolutionScope;
  title: string;
  description: string;
  expectedBenefit: string;
  affectedCapabilities?: string[];
  requiredSignals?: string[];
  priority?: AIAutonomousEvolutionPriority;
  proposedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function createAIAutonomousEvolutionCandidate(
  input: CreateAIAutonomousEvolutionCandidateInput,
): AIAutonomousEvolutionCandidate {
  const createdAt = input.createdAt ?? new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    scope: input.scope,
    title: input.title,
    description: input.description,
    expectedBenefit: input.expectedBenefit,
    affectedCapabilities: input.affectedCapabilities ?? [],
    requiredSignals: input.requiredSignals ?? [],
    priority: input.priority ?? "medium",
    status: "proposed",
    proposedBy: input.proposedBy,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function markAIAutonomousEvolutionCandidateStatus(
  candidate: AIAutonomousEvolutionCandidate,
  status: AIAutonomousEvolutionStatus,
): AIAutonomousEvolutionCandidate {
  return {
    ...candidate,
    status,
    updatedAt: new Date(),
  };
}