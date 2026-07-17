export type CustomerOnboardingStage =
  | "scheduled"
  | "kickoff"
  | "workspace"
  | "configuration"
  | "migration"
  | "training"
  | "validation"
  | "go-live"
  | "completed";

export interface CustomerOnboardingRecord {
  organizationId: string;
  companyName: string;
  owner: string;
  stage: CustomerOnboardingStage;
  progress: number;
  kickoffDate?: string;
  targetGoLiveDate?: string;
}