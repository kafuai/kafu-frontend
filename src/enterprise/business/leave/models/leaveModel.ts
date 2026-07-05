import { LeaveStatus, LeaveType } from "../types/leaveTypes";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  organizationId: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: number;
  endDate: number;
  reason: string;
  createdAt: number;
}