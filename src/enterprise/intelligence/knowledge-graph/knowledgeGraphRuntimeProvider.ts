import { EnterpriseKnowledgeGraphRuntimeContract } from "./knowledgeGraphRuntimeContracts";
import { KnowledgeGraphRuntimeFactory } from "./knowledgeGraphRuntimeFactory";

export class KnowledgeGraphRuntimeProvider {
  private readonly factory = new KnowledgeGraphRuntimeFactory();
  private runtime?: EnterpriseKnowledgeGraphRuntimeContract;

  getRuntime(): EnterpriseKnowledgeGraphRuntimeContract {
    if (!this.runtime) {
      this.runtime = this.factory.create();
    }

    return this.runtime;
  }

  reset(): void {
    this.runtime?.reset();
    this.runtime = undefined;
  }
}