import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { AIInnovationSignal } from "./aiInnovationSignal";
import { AIInnovationExperiment } from "./aiInnovationExperiment";
import { AIInnovationAdoptionDecision } from "./aiInnovationAdoption";

export type AIInnovationEventType =
  | "innovation.signal.detected"
  | "innovation.opportunity.created"
  | "innovation.opportunity.scored"
  | "innovation.experiment.started"
  | "innovation.experiment.completed"
  | "innovation.adoption.decided";

export interface AIInnovationEvent<TPayload> {
  id: string;
  organizationId: string;
  type: AIInnovationEventType;
  payload: TPayload;
  occurredAt: Date;
}

export function createAIInnovationSignalDetectedEvent(
  id: string,
  signal: AIInnovationSignal,
): AIInnovationEvent<AIInnovationSignal> {
  return {
    id,
    organizationId: signal.organizationId,
    type: "innovation.signal.detected",
    payload: signal,
    occurredAt: new Date(),
  };
}

export function createAIInnovationOpportunityCreatedEvent(
  id: string,
  opportunity: AIInnovationOpportunity,
): AIInnovationEvent<AIInnovationOpportunity> {
  return {
    id,
    organizationId: opportunity.organizationId,
    type: "innovation.opportunity.created",
    payload: opportunity,
    occurredAt: new Date(),
  };
}

export function createAIInnovationOpportunityScoredEvent(
  id: string,
  opportunity: AIInnovationOpportunity,
): AIInnovationEvent<AIInnovationOpportunity> {
  return {
    id,
    organizationId: opportunity.organizationId,
    type: "innovation.opportunity.scored",
    payload: opportunity,
    occurredAt: new Date(),
  };
}

export function createAIInnovationExperimentStartedEvent(
  id: string,
  experiment: AIInnovationExperiment,
): AIInnovationEvent<AIInnovationExperiment> {
  return {
    id,
    organizationId: experiment.organizationId,
    type: "innovation.experiment.started",
    payload: experiment,
    occurredAt: new Date(),
  };
}

export function createAIInnovationExperimentCompletedEvent(
  id: string,
  experiment: AIInnovationExperiment,
): AIInnovationEvent<AIInnovationExperiment> {
  return {
    id,
    organizationId: experiment.organizationId,
    type: "innovation.experiment.completed",
    payload: experiment,
    occurredAt: new Date(),
  };
}

export function createAIInnovationAdoptionDecidedEvent(
  id: string,
  organizationId: string,
  decision: AIInnovationAdoptionDecision,
): AIInnovationEvent<AIInnovationAdoptionDecision> {
  return {
    id,
    organizationId,
    type: "innovation.adoption.decided",
    payload: decision,
    occurredAt: new Date(),
  };
}