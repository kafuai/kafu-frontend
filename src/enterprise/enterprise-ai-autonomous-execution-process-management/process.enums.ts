export enum EnterpriseAIProcessStatus {
  DRAFT = "draft",
  READY = "ready",
  ACTIVE = "active",
  PAUSED = "paused",
  BLOCKED = "blocked",
  COMPLETED = "completed",
  FAILED = "failed",
  RETIRED = "retired",
}

export enum EnterpriseAIProcessPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum EnterpriseAIProcessRiskLevel {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum EnterpriseAIProcessHealthState {
  HEALTHY = "healthy",
  DEGRADED = "degraded",
  AT_RISK = "at_risk",
  CRITICAL = "critical",
}