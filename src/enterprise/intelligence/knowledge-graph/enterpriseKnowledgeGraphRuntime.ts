import { KnowledgeGraphRuntime } from "./knowledgeGraphRuntime";
import {
  KnowledgeGraphRuntimeInput,
  KnowledgeGraphRuntimeResult,
  KnowledgeGraphRuntimeStatus,
} from "./knowledgeGraphRuntimeTypes";
import { EnterpriseKnowledgeGraphRuntimeContract } from "./knowledgeGraphRuntimeContracts";

export class EnterpriseKnowledgeGraphRuntime
  implements EnterpriseKnowledgeGraphRuntimeContract
{
  constructor(
    private readonly runtime = new KnowledgeGraphRuntime(),
  ) {}

  getStatus(): KnowledgeGraphRuntimeStatus {
    return this.runtime.getStatus();
  }

  execute(
    input: KnowledgeGraphRuntimeInput,
  ): KnowledgeGraphRuntimeResult {
    return this.runtime.run(input);
  }

  reset(): void {
    this.runtime.reset();
  }
}