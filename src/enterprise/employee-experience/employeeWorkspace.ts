import { EmployeeExperienceModel } from "./employeeExperienceTypes";

export class EmployeeWorkspace {
  constructor(private readonly experience: EmployeeExperienceModel) {}

  getExperience(): EmployeeExperienceModel {
    return this.experience;
  }
}
