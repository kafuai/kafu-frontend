import { ExecutiveAlert } from "./executiveExperienceTypes";

export class ExecutiveNotifications {
  constructor(private readonly alerts: ExecutiveAlert[]) {}

  getCriticalNotifications(): ExecutiveAlert[] {
    return this.alerts.filter((alert) => alert.priority === "critical");
  }
}
