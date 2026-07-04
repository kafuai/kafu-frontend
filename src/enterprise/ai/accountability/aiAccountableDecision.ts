import {
  AIAccountabilityDecisionType,
  AIAccountabilityRiskSignal,
  AIAccountabilitySeverity,
  AIAccountabilityStatus,
} from "./aiAccountabilityTypes";

export interface AIAccountableDecision {
  id: string;
  organizationId: string;
  modelId: string;
  workflowId?: string;
  requestId?: string;
  decisionType: AIAccountabilityDecisionType;
  status: AIAccountabilityStatus;
  title: string;
  description: string;
  inputSummary: string;
  outputSummary: string;
  businessContext: string;
  riskLevel: AIAccountabilitySeverity;
  riskSignals: AIAccountabilityRiskSignal[];
  accountableOwnerId?: string;
  humanReviewed: boolean;
  humanReviewerId?: string;
  automated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAccountableDecisionInput {
  id: string;
  organizationId: string;
  modelId: string;
  workflowId?: string;
  requestId?: string;
  decisionType: AIAccountabilityDecisionType;
  title: string;
  description: string;
  inputSummary: string;
  outputSummary: string;
  businessContext: string;
  riskLevel: AIAccountabilitySeverity;
  riskSignals?: AIAccountabilityRiskSignal[];
  accountableOwnerId?: string;
  humanReviewed?: boolean;
  humanReviewerId?: string;
  automated?: boolean;
}

export function createAIAccountableDecision(
  input: CreateAIAccountableDecisionInput,
  now: Date = new Date(),
): AIAccountableDecision {
  return {
    id: input.id,
    organizationId: input.organizationId,
    modelId: input.modelId,
    workflowId: input.workflowId,
    requestId: input.requestId,
    decisionType: input.decisionType,
    status: input.accountableOwnerId ? "assigned" : "draft",
    title: input.title,
    description: input.description,
    inputSummary: input.inputSummary,
    outputSummary: input.outputSummary,
    businessContext: input.businessContext,
    riskLevel: input.riskLevel,
    riskSignals: input.riskSignals ?? [],
    accountableOwnerId: input.accountableOwnerId,
    humanReviewed: input.humanReviewed ?? false,
    humanReviewerId: input.humanReviewerId,
    automated: input.automated ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export function assignDecisionOwner(
  decision: AIAccountableDecision,
  accountableOwnerId: string,
  now: Date = new Date(),
): AIAccountableDecision {
  return {
    ...decision,
    accountableOwnerId,
    status: decision.status === "draft" ? "assigned" : decision.status,
    updatedAt: now,
  };
}

export function markDecisionHumanReviewed(
  decision: AIAccountableDecision,
  humanReviewerId: string,
  now: Date = new Date(),
): AIAccountableDecision {
  return {
    ...decision,
    humanReviewed: true,
    humanReviewerId,
    updatedAt: now,
  };
}

export function requiresAccountabilityEscalation(
  decision: AIAccountableDecision,
): boolean {
  return (
    decision.riskLevel === "critical" ||
    decision.riskSignals.some((signal) => signal.severity === "critical") ||
    (!decision.humanReviewed && decision.riskLevel === "high")
  );
}