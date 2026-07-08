import { EmployeeExperienceModel } from "./employeeExperienceTypes";

export class EmployeeWellbeing {
  constructor(private readonly experience: EmployeeExperienceModel) {}

  needsSupport(): boolean {
    return this.experience.engagementScore < 50;
  }
}
