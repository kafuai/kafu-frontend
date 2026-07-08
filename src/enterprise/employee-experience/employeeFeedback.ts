import { EmployeeFeedbackItem } from "./employeeExperienceTypes";

export class EmployeeFeedback {
  constructor(private readonly feedback: EmployeeFeedbackItem[]) {}

  getFeedback(): EmployeeFeedbackItem[] {
    return this.feedback;
  }
}
