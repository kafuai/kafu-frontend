import { AttendanceStatus } from "../types/attendanceTypes";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  organizationId: string;
  checkIn: number;
  checkOut?: number;
  status: AttendanceStatus;
}