export type DepartmentStatus = "active" | "inactive";

export interface CreateDepartmentInput {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly code: string;
  readonly managerId?: string;
  readonly parentDepartmentId?: string;
}