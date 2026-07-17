export type EnterpriseDemoOrchestrationStatus =
  | "idle"
  | "preparing"
  | "ready"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type EnterpriseDemoOrchestrationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EnterpriseDemoOrchestrationStepStatus =
  | "pending"
  | "ready"
  | "running"
  | "completed"
  | "skipped"
  | "failed";

export interface EnterpriseDemoOrchestrationStep {
  id: string;
  title: string;
  description: string;
  sequence: number;
  status: EnterpriseDemoOrchestrationStepStatus;
  required: boolean;
  estimatedDurationSeconds?: number | null;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoOrchestrationPlan {
  id: string;
  organizationId: string;
  demoSessionId: string;
  scenarioId: string;
  title: string;
  priority: EnterpriseDemoOrchestrationPriority;
  status: EnterpriseDemoOrchestrationStatus;
  steps: EnterpriseDemoOrchestrationStep[];
  currentStepId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDemoOrchestrationInput {
  organizationId: string;
  demoSessionId: string;
  scenarioId: string;
  companyName?: string | null;
  presenterName?: string | null;
  audienceType?: string | null;
  requestedPriority?: EnterpriseDemoOrchestrationPriority;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoOrchestrationResult {
  success: boolean;
  orchestrationId: string;
  status: EnterpriseDemoOrchestrationStatus;
  currentStepId?: string | null;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  message: string;
}
