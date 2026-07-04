export type AIAutonomousLearningStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type AIAutonomousLearningPriority = "low" | "medium" | "high" | "critical";

export type AIAutonomousLearningSignalType =
  | "user_feedback"
  | "system_observation"
  | "performance_metric"
  | "quality_gap"
  | "policy_violation"
  | "business_outcome";

export type AIAutonomousLearningImpact = "positive" | "negative" | "neutral" | "mixed";

export type AIAutonomousLearningConfidence = "low" | "medium" | "high";

export type AIAutonomousLearningObjectiveCategory =
  | "accuracy"
  | "reliability"
  | "safety"
  | "efficiency"
  | "personalization"
  | "governance"
  | "business_value";

export interface AIAutonomousLearningAuditMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}