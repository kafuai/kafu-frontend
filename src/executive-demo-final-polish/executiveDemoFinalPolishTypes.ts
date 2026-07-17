export type ExecutiveDemoStage =
  | "opening"
  | "problem"
  | "discovery"
  | "assessment"
  | "intelligence"
  | "recommendation"
  | "executive-summary"
  | "command-center"
  | "digital-workforce"
  | "closing"
  | "questions";

export type ExecutiveDemoPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ExecutiveDemoCheckpoint {
  id: string;
  title: string;
  stage: ExecutiveDemoStage;
  objective: string;
  expectedOutcome: string;
  estimatedMinutes: number;
  priority: ExecutiveDemoPriority;
}

export interface ExecutiveDemoTransition {
  from: ExecutiveDemoStage;
  to: ExecutiveDemoStage;
  message: string;
}

export interface ExecutiveDemoAgenda {
  title: string;
  totalMinutes: number;
  checkpoints: ExecutiveDemoCheckpoint[];
}

export interface ExecutiveDemoValidationResult {
  ready: boolean;
  totalMinutes: number;
  stages: number;
  missingCriticalStages: string[];
  recommendations: string[];
}
