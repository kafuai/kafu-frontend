import { WorkShiftInput } from "../types/schedulingTypes";

export class SchedulingValidator {
  validateShift(input: WorkShiftInput): boolean {
    return Boolean(
      input.id &&
        input.organizationId &&
        input.name &&
        input.type &&
        input.startTime &&
        input.endTime,
    );
  }
}