import { EmployeeRequest } from "./employeeExperienceTypes";

export class EmployeeRequests {
  constructor(private readonly requests: EmployeeRequest[]) {}

  getOpenRequests(): EmployeeRequest[] {
    return this.requests.filter((request) => request.status !== "completed");
  }
}
