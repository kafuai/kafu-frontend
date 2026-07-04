import {
  AIAutonomousStrategyPriority,
  AIAutonomousStrategyRiskLevel,
  AIAutonomousStrategyTimeHorizon,
} from "./aiAutonomousStrategyTypes";

export type AIStrategySignalSource =
  | "market"
  | "customer"
  | "operations"
  | "finance"
  | "risk"
  | "innovation"
  | "learning"
  | "governance"
  | "executive";

export interface AIStrategySignal {
  id: string;
  organizationId: string;

  source: AIStrategySignalSource;
  title: string;
  summary: string;

  priority: AIAutonomousStrategyPriority;
  riskLevel: AIAutonomousStrategyRiskLevel;
  horizon: AIAutonomousStrategyTimeHorizon;

  confidence: number;
  urgency: number;

  relatedObjectiveIds: string[];

  detectedAt: Date;
}

export interface CreateAIStrategySignalInput {
  id: string;
  organizationId: string;

  source: AIStrategySignalSource;
  title: string;
  summary: string;

  priority?: AIAutonomousStrategyPriority;
  riskLevel?: AIAutonomousStrategyRiskLevel;
  horizon?: AIAutonomousStrategyTimeHorizon;

  confidence?: number;
  urgency?: number;

  relatedObjectiveIds?: string[];

  detectedAt?: Date;
}

export function createAIStrategySignal(input: CreateAIStrategySignalInput): AIStrategySignal {
  return {
    id: input.id,
    organizationId: input.organizationId,

    source: input.source,
    title: input.title,
    summary: input.summary,

    priority: input.priority ?? "medium",
    riskLevel: input.riskLevel ?? "medium",
    horizon: input.horizon ?? "short-term",

    confidence: input.confidence ?? 0.7,
    urgency: input.urgency ?? 0.5,

    relatedObjectiveIds: input.relatedObjectiveIds ?? [],

    detectedAt: input.detectedAt ?? new Date(),
  };
}