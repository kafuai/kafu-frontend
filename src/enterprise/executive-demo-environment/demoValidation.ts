import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoValidation {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  validate(): boolean {
    return this.demo.environment.trim().length > 0;
  }
}
