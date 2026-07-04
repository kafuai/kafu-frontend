export type AIAutonomousEvolutionPriority = "low" | "medium" | "high" | "critical";

export type AIAutonomousEvolutionRiskLevel = "low" | "medium" | "high" | "critical";

export type AIAutonomousEvolutionStatus =
  | "proposed"
  | "assessing"
  | "approved"
  | "rejected"
  | "planned"
  | "executing"
  | "completed"
  | "failed"
  | "rolled_back";

export type AIAutonomousEvolutionDecisionType =
  | "approve"
  | "reject"
  | "defer"
  | "require_human_review";

export type AIAutonomousEvolutionSignalType =
  | "learning_pattern"
  | "performance_gap"
  | "governance_constraint"
  | "safety_constraint"
  | "optimization_opportunity"
  | "user_feedback"
  | "runtime_observation";

export type AIAutonomousEvolutionScope =
  | "capability"
  | "policy"
  | "workflow"
  | "agent_behavior"
  | "runtime_strategy"
  | "knowledge_model";