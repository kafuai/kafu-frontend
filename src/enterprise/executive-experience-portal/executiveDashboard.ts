import { ExecutiveMetric } from "./executiveExperienceTypes";

export class ExecutiveDashboard {
  constructor(private readonly metrics: ExecutiveMetric[]) {}

  getMetrics(): ExecutiveMetric[] {
    return this.metrics;
  }
}
