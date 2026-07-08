import { EmployeeRequest } from "./employeeExperienceTypes";

export class EmployeeNotifications {
  constructor(private readonly requests: EmployeeRequest[]) {}

  getAttentionItems(): EmployeeRequest[] {
    return this.requests.filter((request) => request.status === "needs_attention");
  }
}
