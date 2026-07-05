import { LeaveRequest } from "../models/leaveModel";
import { LeaveRequestInput } from "../types/leaveTypes";
import { LeaveValidator } from "../utils/leaveValidator";

export class LeaveManager {
  private readonly validator = new LeaveValidator();
  private readonly requests = new Map<string, LeaveRequest>();

  request(input: LeaveRequestInput): LeaveRequest {
    if (!this.validator.validateRequest(input)) {
      throw new Error("Invalid leave request.");
    }

    const leave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: input.employeeId,
      organizationId: input.organizationId,
      type: input.type,
      status: "pending",
      startDate: input.startDate,
      endDate: input.endDate,
      reason: input.reason,
      createdAt: Date.now(),
    };

    this.requests.set(leave.id, leave);

    return leave;
  }

  approve(id: string): LeaveRequest {
    const leave = this.requests.get(id);

    if (!leave) {
      throw new Error("Leave request not found.");
    }

    const updated: LeaveRequest = {
      ...leave,
      status: "approved",
    };

    this.requests.set(id, updated);

    return updated;
  }

  list(): LeaveRequest[] {
    return Array.from(this.requests.values());
  }
}