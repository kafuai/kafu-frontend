import { CommunicationEngine } from "./communicationEngine";

export class CommunicationRuntime {
  private readonly engine = new CommunicationEngine();

  getEngine(): CommunicationEngine {
    return this.engine;
  }
}