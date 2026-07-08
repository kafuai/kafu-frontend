export type EmployeeLifecycleStatus =
  | "preboarding"
  | "onboarding"
  | "active"
  | "transition"
  | "development"
  | "offboarding"
  | "exited";

export type EmployeeEngagementLevel =
  | "low"
  | "medium"
  | "high"
  | "excellent";

export interface EmployeeLifecycle {
  id: string;
  employeeId: string;
  employeeName: string;
  status: EmployeeLifecycleStatus;
  department: string;
  role: string;
  startDate: string;
  updatedAt: string;
}

export interface EmployeeMetric {
  name: string;
  value: number;
  measuredAt: string;
}
