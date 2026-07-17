import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoValidation {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  isValid(): boolean {
    return (
      this.demo.scenarios.length > 0 &&
      this.demo.datasets.length > 0
    );
  }
}