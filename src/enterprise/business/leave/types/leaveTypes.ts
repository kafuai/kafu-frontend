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
  id?: string;                    // NEW: pre-generated so the storage path can contain it
  attachment?: LeaveAttachment; 
}
export interface LeaveAttachment {
  bucket: string;
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}