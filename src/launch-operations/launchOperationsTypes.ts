export type LaunchOperationsStatus =
  | "planned"
  | "ready"
  | "active"
  | "stabilizing"
  | "completed"
  | "blocked";

export interface LaunchOperationsRecord {
  organizationId: string;
  launchName: string;
  launchOwner: string;
  status: LaunchOperationsStatus;
  targetLaunchDate: string;
  supportWindowStart?: string;
  supportWindowEnd?: string;
}
