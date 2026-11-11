import { AttendanceRecord } from "../models/attendanceModel";
import { AttendanceCheckInInput } from "../types/attendanceTypes";
import { AttendanceValidator } from "../utils/attendanceValidator";

export class AttendanceManager {
  private readonly validator = new AttendanceValidator();
  private readonly records = new Map<string, AttendanceRecord>();

  checkIn(input: AttendanceCheckInInput): AttendanceRecord {
    if (!this.validator.validateCheckIn(input)) {
      throw new Error("Invalid attendance input.");
    }

    const record: AttendanceRecord = {
      id: `attendance-${Date.now()}`,
      employeeId: input.employeeId,
      organizationId: input.organizationId,
      checkIn: input.timestamp,
      status: "present",
    };

    this.records.set(record.id, record);

    return record;
  }

  checkOut(recordId: string, timestamp: number): AttendanceRecord {
    const record = this.records.get(recordId);

    if (!record) {
      throw new Error("Attendance record not found.");
    }

    const updated: AttendanceRecord = {
      ...record,
      checkOut: timestamp,
    };

    this.records.set(recordId, updated);

    return updated;
  }

  list(): AttendanceRecord[] {
    return Array.from(this.records.values());
  }
}