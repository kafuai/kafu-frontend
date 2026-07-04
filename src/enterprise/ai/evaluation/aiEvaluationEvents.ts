import {
  AIEvaluationGrade,
  AIEvaluationRiskLevel,
  AIEvaluationStatus,
} from "./aiEvaluationTypes";

export interface AIEvaluationStartedEvent {
  type: "ai.evaluation.started";
  runId: string;
  organizationId: string;
  startedAt: Date;
}

export interface AIEvaluationCompletedEvent {
  type: "ai.evaluation.completed";
  runId: string;
  organizationId: string;
  status: AIEvaluationStatus;
  averageScore: number;
  grade: AIEvaluationGrade;
  riskLevel: AIEvaluationRiskLevel;
  completedAt: Date;
}

export interface AIEvaluationFailedEvent {
  type: "ai.evaluation.failed";
  runId: string;
  organizationId: string;
  reason: string;
  failedAt: Date;
}

export type AIEvaluationEvent =
  | AIEvaluationStartedEvent
  | AIEvaluationCompletedEvent
  | AIEvaluationFailedEvent;