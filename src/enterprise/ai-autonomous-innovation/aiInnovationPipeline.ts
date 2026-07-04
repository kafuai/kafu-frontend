import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { AIInnovationSignal } from "./aiInnovationSignal";
import { createAIInnovationOpportunityFromSignal } from "./aiInnovationOpportunity";
import {
  AIInnovationImpactEstimate,
  AIInnovationFeasibilityEstimate,
  AIInnovationOpportunityType,
  AIInnovationRiskLevel,
  AIInnovationStatus,
} from "./aiAutonomousInnovationTypes";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";
import { applyAIInnovationPriority } from "./aiInnovationPrioritizer";

export interface AIInnovationPipelineConfig {
  createdBy: string;
  defaultType: AIInnovationOpportunityType;
  defaultRiskLevel?: AIInnovationRiskLevel;
  minimumSignalConfidence?: number;
  minimumSignalUrgency?: number;
  sourceMilestone?: string;
}

export interface AIInnovationPipelineResult {
  acceptedSignals: AIInnovationSignal[];
  rejectedSignals: AIInnovationSignal[];
  opportunities: AIInnovationOpportunity[];
}

function createDefaultImpact(signal: AIInnovationSignal): AIInnovationImpactEstimate {
  return {
    revenuePotential: signal.urgency * 0.6,
    costReductionPotential: signal.urgency * 0.45,
    customerValue: signal.confidence * 0.7,
    operationalEfficiency: signal.urgency * 0.65,
    strategicAlignment: signal.confidence * 0.75,
  };
}

function createDefaultFeasibility(signal: AIInnovationSignal): AIInnovationFeasibilityEstimate {
  return {
    technicalFeasibility: signal.confidence * 0.8,
    dataReadiness: signal.confidence * 0.75,
    implementationEffort: 1 - signal.urgency * 0.4,
    organizationalReadiness: signal.confidence * 0.65,
    dependencyComplexity: 1 - signal.confidence * 0.5,
  };
}

export function runAIInnovationPipeline(
  organizationId: string,
  signals: AIInnovationSignal[],
  config: AIInnovationPipelineConfig,
): AIInnovationPipelineResult {
  const minimumSignalConfidence = config.minimumSignalConfidence ?? 0.5;
  const minimumSignalUrgency = config.minimumSignalUrgency ?? 0.45;

  const acceptedSignals = signals.filter(
    (signal) =>
      signal.organizationId === organizationId &&
      signal.confidence >= minimumSignalConfidence &&
      signal.urgency >= minimumSignalUrgency,
  );

  const rejectedSignals = signals.filter(
    (signal) =>
      signal.organizationId !== organizationId ||
      signal.confidence < minimumSignalConfidence ||
      signal.urgency < minimumSignalUrgency,
  );

  const opportunities: AIInnovationOpportunity[] = acceptedSignals.map((signal) => {
    const opportunity = createAIInnovationOpportunityFromSignal(signal, {
      id: `innovation-${signal.id}`,
      type: config.defaultType,
      title: signal.title,
      description: signal.description,
      hypothesis: `If we address "${signal.title}", the organization can unlock measurable innovation value.`,
      expectedOutcome: "Validated innovation opportunity with measurable impact and adoption path.",
      riskLevel: config.defaultRiskLevel ?? "medium",
      impact: createDefaultImpact(signal),
      feasibility: createDefaultFeasibility(signal),
      createdBy: config.createdBy,
      sourceMilestone: config.sourceMilestone,
      traceId: signal.id,
    });

    const prioritizedOpportunity = applyAIInnovationPriority(opportunity);
    const scoredOpportunity = scoreAIInnovationOpportunity(prioritizedOpportunity);

    const status: AIInnovationStatus =
      scoredOpportunity.totalScore >= 0.45 ? "scored" : "identified";

    return {
      ...prioritizedOpportunity,
      status,
    };
  });

  return {
    acceptedSignals,
    rejectedSignals,
    opportunities,
  };
}