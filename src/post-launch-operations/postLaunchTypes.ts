export type PostLaunchStatus =
  | "monitoring"
  | "stabilizing"
  | "healthy"
  | "degraded"
  | "completed";

export interface PostLaunchRecord {
  organizationId: string;
  customerName: string;
  customerSuccessOwner: string;
  status: PostLaunchStatus;
  goLiveDate: string;
  stabilizationEndDate?: string;
}
