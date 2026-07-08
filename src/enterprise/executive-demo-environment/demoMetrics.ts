import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoMetrics {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  getScenarioCount(): number {
    return this.demo.scenarios.length;
  }

  getDatasetCount(): number {
    return this.demo.datasets.length;
  }
}
