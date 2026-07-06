export type PositionStatus = "active" | "inactive";

export interface CreatePositionInput {
  readonly id: string;
  readonly organizationId: string;
  readonly departmentId: string;
  readonly title: string;
  readonly code: string;
  readonly grade?: string;
  readonly reportsToPositionId?: string;
}