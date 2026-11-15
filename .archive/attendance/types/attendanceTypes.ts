export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "leave"
  | "remote";

export interface AttendanceCheckInInput {
  employeeId: string;
  organizationId: string;
  timestamp: number;
}