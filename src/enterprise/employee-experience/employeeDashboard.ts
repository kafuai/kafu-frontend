import { EmployeeExperienceModel } from "./employeeExperienceTypes";

export class EmployeeDashboard {
  constructor(private readonly experience: EmployeeExperienceModel) {}

  getEngagementScore(): number {
    return this.experience.engagementScore;
  }
}
