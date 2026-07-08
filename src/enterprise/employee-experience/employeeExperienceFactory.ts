import { EmployeeExperienceModel } from "./employeeExperienceTypes";
import { EmployeeWorkspace } from "./employeeWorkspace";
import { EmployeeDashboard } from "./employeeDashboard";
import { EmployeeJourney } from "./employeeJourney";
import { EmployeeFeedback } from "./employeeFeedback";
import { EmployeeEngagement } from "./employeeEngagement";
import { EmployeeRecognition } from "./employeeRecognition";
import { EmployeeGrowth } from "./employeeGrowth";
import { EmployeeWellbeing } from "./employeeWellbeing";
import { EmployeeRequests } from "./employeeRequests";
import { EmployeeNotifications } from "./employeeNotifications";

export class EmployeeExperienceFactory {
  static create(experience: EmployeeExperienceModel) {
    return {
      workspace: new EmployeeWorkspace(experience),
      dashboard: new EmployeeDashboard(experience),
      journey: new EmployeeJourney(experience),
      feedback: new EmployeeFeedback(experience.feedback),
      engagement: new EmployeeEngagement(experience),
      recognition: new EmployeeRecognition(experience.employee),
      growth: new EmployeeGrowth(experience.employee),
      wellbeing: new EmployeeWellbeing(experience),
      requests: new EmployeeRequests(experience.requests),
      notifications: new EmployeeNotifications(experience.requests),
    };
  }
}
