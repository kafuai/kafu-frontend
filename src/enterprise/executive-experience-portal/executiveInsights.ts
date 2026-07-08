import { ExecutiveMetric } from "./executiveExperienceTypes";

export class ExecutiveInsights {
  summarize(metrics: ExecutiveMetric[]): string {
    return `${metrics.length} executive metrics available.`;
  }
}
