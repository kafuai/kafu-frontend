import { ExecutiveAlert } from "./executiveExperienceTypes";

export class ExecutiveAlerts {
  constructor(private readonly alerts: ExecutiveAlert[]) {}

  getActive(): ExecutiveAlert[] {
    return this.alerts;
  }
}
