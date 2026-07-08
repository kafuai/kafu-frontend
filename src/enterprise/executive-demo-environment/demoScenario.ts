import { DemoScenarioModel } from "./executiveDemoTypes";

export class DemoScenario {
  constructor(private readonly scenarios: DemoScenarioModel[]) {}

  getScenarios(): DemoScenarioModel[] {
    return this.scenarios;
  }
}
