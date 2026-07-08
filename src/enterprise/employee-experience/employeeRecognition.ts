import { EmployeeProfile } from "./employeeExperienceTypes";

export class EmployeeRecognition {
  constructor(private readonly employee: EmployeeProfile) {}

  getRecognitionOwner(): string {
    return this.employee.name;
  }
}
