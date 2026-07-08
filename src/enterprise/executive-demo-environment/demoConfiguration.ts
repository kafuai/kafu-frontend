import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoConfiguration {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  isReady(): boolean {
    return this.demo.scenarios.length > 0 && this.demo.datasets.length > 0;
  }
}
