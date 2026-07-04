import { AIExecutionPredictionSignal } from "./aiExecutionPredictionSignal";
import {
  AIExecutionPredictionAuditMetadata,
  AIExecutionPredictionConstraint,
  AIExecutionPredictionRiskLevel,
  AIExecutionPredictionScenarioStatus,
} from "./aiExecutionPredictionTypes";

export interface AIExecutionPredictionScenario {
  id: string;
  signalId: string;
  title: string;
  description: string;
  successProbability: number;
  failureProbability: number;
  delayProbability: number;
  riskProbability: number;
  optimizationPotential: number;
  confidence: number;
  riskLevel: AIExecutionPredictionRiskLevel;
  constraints: AIExecutionPredictionConstraint[];
  status: AIExecutionPredictionScenarioStatus;
  metadata: AIExecutionPredictionAuditMetadata;
}

export interface CreateAIExecutionPredictionScenarioInput {
  id: string;
  signal: AIExecutionPredictionSignal;
  title: string;
  description: string;
  successProbability: number;
  failureProbability: number;
  delayProbability: number;
  riskProbability: number;
  optimizationPotential: number;
  confidence?: number;
  riskLevel: AIExecutionPredictionRiskLevel;
  constraints?: AIExecutionPredictionConstraint[];
  status?: AIExecutionPredictionScenarioStatus;
  metadata?: AIExecutionPredictionAuditMetadata;
}

export function createAIExecutionPredictionScenario(
  input: CreateAIExecutionPredictionScenarioInput,
): AIExecutionPredictionScenario {
  return {
    id: input.id,
    signalId: input.signal.id,
    title: input.title,
    description: input.description,
    successProbability: normalizeAIExecutionPredictionMetric(
      input.successProbability,
    ),
    failureProbability: normalizeAIExecutionPredictionMetric(
      input.failureProbability,
    ),
    delayProbability: normalizeAIExecutionPredictionMetric(
      input.delayProbability,
    ),
    riskProbability: normalizeAIExecutionPredictionMetric(input.riskProbability),
    optimizationPotential: normalizeAIExecutionPredictionMetric(
      input.optimizationPotential,
    ),
    confidence: normalizeAIExecutionPredictionMetric(
      input.confidence ?? input.signal.confidence,
    ),
    riskLevel: input.riskLevel,
    constraints: input.constraints ?? [],
    status: input.status ?? "proposed",
    metadata: input.metadata ?? input.signal.metadata,
  };
}

export function hasBlockingAIExecutionPredictionConstraint(
  scenario: AIExecutionPredictionScenario,
): boolean {
  return scenario.constraints.some((constraint) => constraint.blocking);
}

export function normalizeAIExecutionPredictionMetric(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}