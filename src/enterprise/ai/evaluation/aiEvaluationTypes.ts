export type AIEvaluationStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AIEvaluationTargetType =
  | "model"
  | "agent"
  | "workflow"
  | "prompt"
  | "response"
  | "dataset";

export type AIEvaluationCriterionType =
  | "accuracy"
  | "relevance"
  | "groundedness"
  | "safety"
  | "fairness"
  | "privacy"
  | "compliance"
  | "latency"
  | "cost"
  | "user_experience"
  | "business_value"
  | "custom";

export type AIEvaluationRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIEvaluationGrade =
  | "excellent"
  | "good"
  | "acceptable"
  | "weak"
  | "failed";

export interface AIEvaluationCriterion {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  type: AIEvaluationCriterionType;
  weight: number;
  minimumScore: number;
  maximumScore: number;
  passingScore: number;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIEvaluationRubricLevel {
  id: string;
  label: string;
  score: number;
  description: string;
}

export interface AIEvaluationRubric {
  id: string;
  organizationId: string;
  criterionId: string;
  name: string;
  description: string;
  levels: AIEvaluationRubricLevel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIEvaluationTarget {
  id: string;
  organizationId: string;
  type: AIEvaluationTargetType;
  name: string;
  version?: string;
  ownerTeam?: string;
  metadata?: Record<string, unknown>;
}

export interface AIEvaluationSample {
  id: string;
  input: string;
  expectedOutput?: string;
  actualOutput: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

export interface AIEvaluationScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maximumScore: number;
  weightedScore: number;
  passed: boolean;
  notes?: string;
}

export interface AIEvaluationResult {
  id: string;
  organizationId: string;
  runId: string;
  sampleId: string;
  scores: AIEvaluationScore[];
  totalScore: number;
  maximumScore: number;
  percentageScore: number;
  grade: AIEvaluationGrade;
  riskLevel: AIEvaluationRiskLevel;
  passed: boolean;
  findings: string[];
  recommendations: string[];
  evaluatedAt: Date;
}

export interface AIEvaluationRun {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  target: AIEvaluationTarget;
  status: AIEvaluationStatus;
  criteria: AIEvaluationCriterion[];
  samples: AIEvaluationSample[];
  results: AIEvaluationResult[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIEvaluationCriterionInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  type: AIEvaluationCriterionType;
  weight: number;
  minimumScore: number;
  maximumScore: number;
  passingScore: number;
  isRequired?: boolean;
}

export interface CreateAIEvaluationRubricInput {
  id: string;
  organizationId: string;
  criterionId: string;
  name: string;
  description: string;
  levels: AIEvaluationRubricLevel[];
}

export interface CreateAIEvaluationRunInput {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  target: AIEvaluationTarget;
  criteria: AIEvaluationCriterion[];
  samples: AIEvaluationSample[];
}