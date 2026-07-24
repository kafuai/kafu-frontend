export type DemoExperienceStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type DemoStepType =
  | "introduction"
  | "navigation"
  | "action"
  | "insight"
  | "completion";

export interface DemoExperienceStep {
  readonly id: string;
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly type: DemoStepType;
  readonly route: string;
  readonly order: number;
  readonly estimatedMinutes: number;
  readonly required: boolean;
}

export interface DemoExperience {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly status: DemoExperienceStatus;
  readonly steps: readonly DemoExperienceStep[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DemoStepProgress {
  readonly stepId: string;
  readonly completed: boolean;
  readonly completedAt?: string;
}

export interface DemoExperienceSession {
  readonly id: string;
  readonly experienceId: string;
  readonly userId: string;
  readonly companyId?: string;
  readonly currentStepId: string | null;
  readonly progress: readonly DemoStepProgress[];
  readonly startedAt: string;
  readonly completedAt?: string;
}

export interface DemoExperienceSummary {
  readonly totalSteps: number;
  readonly completedSteps: number;
  readonly progressPercentage: number;
  readonly estimatedMinutesRemaining: number;
}
