import {
  EnterpriseDemoRuntimeSnapshot,
  EnterpriseDemoRuntimeStatus,
} from "../enterprise-demo-runtime";

export type EnterpriseDemoExperienceMode =
  | "guided"
  | "executive"
  | "operator";

export type EnterpriseDemoExperienceStage =
  | "welcome"
  | "scenario-selection"
  | "ready"
  | "running"
  | "results"
  | "error";

export interface EnterpriseDemoExperienceConfiguration {
  organizationId: string;
  workspaceId: string;
  title: string;
  subtitle?: string | null;
  mode: EnterpriseDemoExperienceMode;
  initiatedBy: string;
  defaultScenarioId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoExperienceScenarioOption {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  estimatedDurationMinutes?: number | null;
  recommended?: boolean;
  enabled: boolean;
}

export interface EnterpriseDemoExperienceProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  percentage: number;
  activeStepId?: string | null;
  activeStepTitle?: string | null;
}

export interface EnterpriseDemoExperienceState {
  configuration: EnterpriseDemoExperienceConfiguration;
  stage: EnterpriseDemoExperienceStage;
  runtimeStatus: EnterpriseDemoRuntimeStatus;
  selectedScenarioId?: string | null;
  scenarios: EnterpriseDemoExperienceScenarioOption[];
  progress: EnterpriseDemoExperienceProgress;
  runtimeSnapshot?: EnterpriseDemoRuntimeSnapshot | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  updatedAt: string;
}

export interface EnterpriseDemoExperienceInitializationInput {
  configuration: EnterpriseDemoExperienceConfiguration;
  scenarios?: EnterpriseDemoExperienceScenarioOption[];
}

export interface EnterpriseDemoExperienceScenarioSelectionInput {
  scenarioId: string;
}

export interface EnterpriseDemoExperienceProgressInput {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number;
  activeStepId?: string | null;
  activeStepTitle?: string | null;
}
