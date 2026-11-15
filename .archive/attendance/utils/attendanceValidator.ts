import { AttendanceCheckInInput } from "../types/attendanceTypes";

export class AttendanceValidator {
  validateCheckIn(input: AttendanceCheckInInput): boolean {
    return Boolean(
      input.employeeId &&
      input.organizationId &&
      input.timestamp,
    );
  }
}