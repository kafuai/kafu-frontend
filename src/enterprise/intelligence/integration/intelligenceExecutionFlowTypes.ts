export type IntelligenceExecutionStatus =
  | "idle"
  | "assembling_context"
  | "integrating_memory"
  | "integrating_reasoning"
  | "integrating_decision"
  | "integrating_recommendation"
  | "completed"
  | "failed";

export type IntelligenceExecutionInput = {
  organizationId: string;
  objective: string;
  requestedBy?: string;
};

export type IntelligenceExecutionStep = {
  name: string;
  status: IntelligenceExecutionStatus;
  success: boolean;
  message?: string;
};

export type IntelligenceExecutionResult = {
  organizationId: string;
  objective: string;
  status: IntelligenceExecutionStatus;
  steps: IntelligenceExecutionStep[];
  startedAt: string;
  completedAt?: string;
};