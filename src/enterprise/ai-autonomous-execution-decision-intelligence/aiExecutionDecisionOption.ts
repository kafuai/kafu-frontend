import { AIExecutionDecisionSignal } from "./aiExecutionDecisionSignal";
import {
  AIExecutionDecisionAuditMetadata,
  AIExecutionDecisionConstraint,
  AIExecutionDecisionOptionStatus,
  AIExecutionDecisionRiskLevel,
} from "./aiExecutionDecisionIntelligenceTypes";

export interface AIExecutionDecisionOption {
  id: string;
  signalId: string;
  title: string;
  description: string;
  expectedImpact: number;
  confidence: number;
  feasibility: number;
  urgency: number;
  riskLevel: AIExecutionDecisionRiskLevel;
  constraints: AIExecutionDecisionConstraint[];
  status: AIExecutionDecisionOptionStatus;
  metadata: AIExecutionDecisionAuditMetadata;
}

export interface CreateAIExecutionDecisionOptionInput {
  id: string;
  signal: AIExecutionDecisionSignal;
  title: string;
  description: string;
  expectedImpact: number;
  confidence?: number;
  feasibility: number;
  urgency?: number;
  riskLevel: AIExecutionDecisionRiskLevel;
  constraints?: AIExecutionDecisionConstraint[];
  status?: AIExecutionDecisionOptionStatus;
  metadata?: AIExecutionDecisionAuditMetadata;
}

export function createAIExecutionDecisionOption(
  input: CreateAIExecutionDecisionOptionInput,
): AIExecutionDecisionOption {
  return {
    id: input.id,
    signalId: input.signal.id,
    title: input.title,
    description: input.description,
    expectedImpact: normalizeAIExecutionDecisionMetric(input.expectedImpact),
    confidence: normalizeAIExecutionDecisionMetric(
      input.confidence ?? input.signal.confidence,
    ),
    feasibility: normalizeAIExecutionDecisionMetric(input.feasibility),
    urgency: normalizeAIExecutionDecisionMetric(
      input.urgency ?? input.signal.urgency,
    ),
    riskLevel: input.riskLevel,
    constraints: input.constraints ?? [],
    status: input.status ?? "proposed",
    metadata: input.metadata ?? input.signal.metadata,
  };
}

export function hasBlockingAIExecutionDecisionConstraint(
  option: AIExecutionDecisionOption,
): boolean {
  return option.constraints.some((constraint) => constraint.blocking);
}

export function normalizeAIExecutionDecisionMetric(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}