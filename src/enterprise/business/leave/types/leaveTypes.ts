export type LeaveType =
  | "annual"
  | "sick"
  | "emergency"
  | "unpaid"
  | "maternity"
  | "other";

export type LeaveStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface LeaveRequestInput {
  employeeId: string;
  organizationId: string;
  type: LeaveType;
  startDate: number;
  endDate: number;
  reason: string;
}