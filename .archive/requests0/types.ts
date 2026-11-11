export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export function formatShortReference(id: string): string {
  const shortId = id.replace(/-/g, "").slice(-6).toUpperCase();
  return `REQ-${shortId}`;
}

export type LeaveBalanceInfo = {
  year: number;
  allowance: number;
  approved: number;
  pending: number;
  used: number;
  remaining: number;
  requested: number;
  remainingAfter: number;
};

export type EmployeeRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: "leave" | "employment_letter";
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  requestedDates?: string;
  leaveTypeLabel?: string;
  leaveBalance?: LeaveBalanceInfo | null;
  hasAttachment?: boolean;
  attachmentName?: string | null;
};

export type ApiLeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: "leave" | "employment_letter";
  status: RequestStatus;
  reason: string;
  startDate: number;
  endDate: number;
  createdAt: number;
  leaveType?: string;
  leaveBalance?: LeaveBalanceInfo | null;
  hasAttachment?: boolean;
  attachmentName?: string | null;
};