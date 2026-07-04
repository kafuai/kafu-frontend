export type ExecutionInsightSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutionInsightCategory =
  | "performance"
  | "reliability"
  | "cost"
  | "risk"
  | "quality"
  | "efficiency"
  | "automation";

export interface ExecutionInsightSignal {
  readonly signalId: string;
  readonly source: string;
  readonly metric: string;
  readonly value: number;
  readonly baseline?: number;
  readonly threshold?: number;
  readonly timestamp: string;
}

export interface ExecutionInsight {
  readonly insightId: string;
  readonly title: string;
  readonly description: string;
  readonly category: ExecutionInsightCategory;
  readonly severity: ExecutionInsightSeverity;
  readonly confidence: number;
  readonly signals: readonly ExecutionInsightSignal[];
  readonly recommendation: string;
  readonly createdAt: string;
}

export interface ExecutionInsightGenerationInput {
  readonly signals: readonly ExecutionInsightSignal[];
  readonly generatedAt?: string;
}