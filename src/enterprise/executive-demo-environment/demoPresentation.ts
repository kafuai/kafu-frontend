import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoPresentation {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  getPresentationTitle(): string {
    return `Executive Demo - ${this.demo.environment}`;
  }
}
