import {
  CreateDepartmentInput,
  DepartmentStatus,
} from "../types/departmentTypes";

export interface Department extends CreateDepartmentInput {
  readonly status: DepartmentStatus;
  readonly createdAt: number;
  readonly updatedAt: number;
}