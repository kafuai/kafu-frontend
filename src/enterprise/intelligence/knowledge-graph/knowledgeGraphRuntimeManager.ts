import { EnterpriseKnowledgeGraphRuntimeContract } from "./knowledgeGraphRuntimeContracts";
import { KnowledgeGraphRuntimeProvider } from "./knowledgeGraphRuntimeProvider";
import {
  KnowledgeGraphRuntimeInput,
  KnowledgeGraphRuntimeResult,
} from "./knowledgeGraphRuntimeTypes";

export class KnowledgeGraphRuntimeManager {
  constructor(
    private readonly provider = new KnowledgeGraphRuntimeProvider(),
  ) {}

  execute(
    input: KnowledgeGraphRuntimeInput,
  ): KnowledgeGraphRuntimeResult {
    return this.provider.getRuntime().execute(input);
  }

  reset(): void {
    this.provider.reset();
  }

  getRuntime(): EnterpriseKnowledgeGraphRuntimeContract {
    return this.provider.getRuntime();
  }
}