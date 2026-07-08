import { EmployeeExperienceModel } from "./employeeExperienceTypes";

export class EmployeeJourney {
  constructor(private readonly experience: EmployeeExperienceModel) {}

  getJourneyOwner(): string {
    return this.experience.employee.name;
  }
}
