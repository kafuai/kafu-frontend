import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoJourney {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  getJourneyName(): string {
    return this.demo.environment;
  }
}
