import {
  EnterpriseDemoBootstrapConfiguration,
  EnterpriseDemoBootstrapResult,
  EnterpriseDemoFlowExecutionResult,
  EnterpriseDemoFlowStep,
  EnterpriseDemoScenario,
  EnterpriseDemoStateSnapshot,
} from "../enterprise-demo-integration";

export type EnterpriseDemoRuntimeStatus =
  | "idle"
  | "initializing"
  | "ready"
  | "executing"
  | "completed"
  | "failed"
  | "resetting";

export interface EnterpriseDemoRuntimeConfiguration
  extends EnterpriseDemoBootstrapConfiguration {
  initiatedBy: string;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoRuntimeInitializationInput {
  configuration: EnterpriseDemoRuntimeConfiguration;
  scenarios?: EnterpriseDemoScenario[];
}

export interface EnterpriseDemoRuntimeInitializationResult {
  status: EnterpriseDemoRuntimeStatus;
  bootstrap: EnterpriseDemoBootstrapResult;
  state: EnterpriseDemoStateSnapshot;
  initializedAt: string;
}

export interface EnterpriseDemoRuntimeExecutionInput {
  scenarioId?: string;
  steps: EnterpriseDemoFlowStep[];
  initiatedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoRuntimeExecutionResult {
  status: EnterpriseDemoRuntimeStatus;
  sessionId: string;
  scenarioId: string;
  execution: EnterpriseDemoFlowExecutionResult;
  state: EnterpriseDemoStateSnapshot;
  startedAt: string;
  completedAt: string;
}

export interface EnterpriseDemoRuntimeFailure {
  status: "failed";
  message: string;
  occurredAt: string;
}
