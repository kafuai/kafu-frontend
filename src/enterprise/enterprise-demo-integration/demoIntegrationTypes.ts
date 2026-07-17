export type EnterpriseDemoIntegrationStatus =
  | "idle"
  | "bootstrapping"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "resetting";

export type EnterpriseDemoScenarioStatus =
  | "draft"
  | "ready"
  | "active"
  | "completed"
  | "failed"
  | "disabled";

export type EnterpriseDemoFlowStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type EnterpriseDemoSeverity =
  | "info"
  | "warning"
  | "critical";

export interface EnterpriseDemoScenario {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: EnterpriseDemoScenarioStatus;
  priority: number;
  tags: string[];
  entryPoint: string;
  expectedOutcome: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDemoFlowStep {
  id: string;
  scenarioId: string;
  title: string;
  description: string;
  sequence: number;
  status: EnterpriseDemoFlowStepStatus;
  module: string;
  action: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface EnterpriseDemoFlow {
  id: string;
  organizationId: string;
  scenarioId: string;
  status: EnterpriseDemoIntegrationStatus;
  currentStepId?: string | null;
  steps: EnterpriseDemoFlowStep[];
  startedAt?: string | null;
  completedAt?: string | null;
  error?: string | null;
}

export interface EnterpriseDemoBootstrapConfiguration {
  organizationId: string;
  workspaceId: string;
  environment: "development" | "staging" | "production";
  defaultScenarioId?: string | null;
  autoStart: boolean;
  enableDiagnostics: boolean;
  enableDataInjection: boolean;
  enableReset: boolean;
}

export interface EnterpriseDemoBootstrapResult {
  status: EnterpriseDemoIntegrationStatus;
  organizationId: string;
  workspaceId: string;
  registeredScenarioIds: string[];
  selectedScenarioId?: string | null;
  initializedAt: string;
  messages: string[];
}

export interface EnterpriseDemoFlowExecutionContext {
  organizationId: string;
  workspaceId: string;
  sessionId: string;
  scenarioId: string;
  initiatedBy: string;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoFlowExecutionResult {
  flow: EnterpriseDemoFlow;
  successfulSteps: number;
  failedSteps: number;
  skippedSteps: number;
  completionRate: number;
  message: string;
}

export interface EnterpriseDemoDiagnostic {
  id: string;
  severity: EnterpriseDemoSeverity;
  component: string;
  message: string;
  details?: Record<string, unknown>;
  createdAt: string;
}
