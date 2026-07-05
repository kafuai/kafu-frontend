import { LeaveRequestInput } from "../types/leaveTypes";

export class LeaveValidator {
  validateRequest(input: LeaveRequestInput): boolean {
    return Boolean(
      input.employeeId &&
        input.organizationId &&
        input.type &&
        input.startDate &&
        input.endDate &&
        input.reason,
    );
  }
}