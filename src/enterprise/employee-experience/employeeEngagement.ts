import { EmployeeExperienceModel } from "./employeeExperienceTypes";

export class EmployeeEngagement {
  constructor(private readonly experience: EmployeeExperienceModel) {}

  isHealthy(): boolean {
    return this.experience.engagementScore >= 70;
  }
}
