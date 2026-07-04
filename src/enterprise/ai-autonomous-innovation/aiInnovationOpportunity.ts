import {
  AIInnovationAuditMetadata,
  AIInnovationImpactEstimate,
  AIInnovationFeasibilityEstimate,
  AIInnovationOpportunityType,
  AIInnovationPriority,
  AIInnovationRiskLevel,
  AIInnovationStatus,
} from "./aiAutonomousInnovationTypes";
import { AIInnovationSignal } from "./aiInnovationSignal";

export interface AIInnovationOpportunity {
  id: string;
  organizationId: string;
  type: AIInnovationOpportunityType;
  title: string;
  description: string;
  hypothesis: string;
  expectedOutcome: string;
  priority: AIInnovationPriority;
  status: AIInnovationStatus;
  riskLevel: AIInnovationRiskLevel;
  impact: AIInnovationImpactEstimate;
  feasibility: AIInnovationFeasibilityEstimate;
  signalIds: string[];
  capabilityIds: string[];
  audit: AIInnovationAuditMetadata;
}

export interface CreateAIInnovationOpportunityInput {
  id: string;
  organizationId: string;
  type: AIInnovationOpportunityType;
  title: string;
  description: string;
  hypothesis: string;
  expectedOutcome: string;
  priority?: AIInnovationPriority;
  riskLevel?: AIInnovationRiskLevel;
  impact: AIInnovationImpactEstimate;
  feasibility: AIInnovationFeasibilityEstimate;
  signalIds?: string[];
  capabilityIds?: string[];
  createdBy: string;
  sourceMilestone?: string;
  traceId?: string;
}

export function createAIInnovationOpportunity(
  input: CreateAIInnovationOpportunityInput,
): AIInnovationOpportunity {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    type: input.type,
    title: input.title.trim(),
    description: input.description.trim(),
    hypothesis: input.hypothesis.trim(),
    expectedOutcome: input.expectedOutcome.trim(),
    priority: input.priority ?? "medium",
    status: "identified",
    riskLevel: input.riskLevel ?? "medium",
    impact: input.impact,
    feasibility: input.feasibility,
    signalIds: input.signalIds ?? [],
    capabilityIds: input.capabilityIds ?? [],
    audit: {
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
      sourceMilestone: input.sourceMilestone,
      traceId: input.traceId,
    },
  };
}

export function createAIInnovationOpportunityFromSignal(
  signal: AIInnovationSignal,
  input: Omit<
    CreateAIInnovationOpportunityInput,
    "organizationId" | "signalIds" | "capabilityIds"
  >,
): AIInnovationOpportunity {
  return createAIInnovationOpportunity({
    ...input,
    organizationId: signal.organizationId,
    signalIds: [signal.id],
    capabilityIds: signal.relatedCapabilityIds,
  });
}

export function updateAIInnovationOpportunityStatus(
  opportunity: AIInnovationOpportunity,
  status: AIInnovationStatus,
): AIInnovationOpportunity {
  return {
    ...opportunity,
    status,
    audit: {
      ...opportunity.audit,
      updatedAt: new Date(),
    },
  };
}