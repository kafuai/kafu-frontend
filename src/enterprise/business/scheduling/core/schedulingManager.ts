import { WorkShift } from "../models/schedulingModel";
import { WorkShiftInput } from "../types/schedulingTypes";
import { SchedulingValidator } from "../utils/schedulingValidator";

export class SchedulingManager {
  private readonly validator = new SchedulingValidator();
  private readonly shifts = new Map<string, WorkShift>();

  createShift(input: WorkShiftInput): WorkShift {
    if (!this.validator.validateShift(input)) {
      throw new Error("Invalid work shift.");
    }

    const shift: WorkShift = {
      ...input,
      createdAt: Date.now(),
    };

    this.shifts.set(shift.id, shift);

    return shift;
  }

  getShift(id: string): WorkShift | undefined {
    return this.shifts.get(id);
  }

  listShifts(): WorkShift[] {
    return Array.from(this.shifts.values());
  }

  count(): number {
    return this.shifts.size;
  }
}