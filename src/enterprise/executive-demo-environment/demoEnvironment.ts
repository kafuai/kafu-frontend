import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoEnvironment {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  getEnvironment(): string {
    return this.demo.environment;
  }
}
