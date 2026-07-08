import { EmployeeProfile } from "./employeeExperienceTypes";

export class EmployeeGrowth {
  constructor(private readonly employee: EmployeeProfile) {}

  getGrowthTrack(): string {
    return `${this.employee.role} growth track`;
  }
}
