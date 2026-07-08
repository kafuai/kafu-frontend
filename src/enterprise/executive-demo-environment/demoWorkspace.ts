import { ExecutiveDemoModel } from "./executiveDemoTypes";

export class DemoWorkspace {
  constructor(private readonly demo: ExecutiveDemoModel) {}

  getWorkspace(): ExecutiveDemoModel {
    return this.demo;
  }
}
