import { EnterpriseKnowledgeGraphRuntime } from "./enterpriseKnowledgeGraphRuntime";
import {
  KnowledgeGraphRuntimeInput,
  KnowledgeGraphRuntimeResult,
  KnowledgeGraphRuntimeStatus,
} from "./knowledgeGraphRuntimeTypes";

export class KnowledgeGraphRuntimeBridge {
  constructor(
    private readonly runtime = new EnterpriseKnowledgeGraphRuntime(),
  ) {}

  getStatus(): KnowledgeGraphRuntimeStatus {
    return this.runtime.getStatus();
  }

  buildKnowledgeGraph(
    input: KnowledgeGraphRuntimeInput,
  ): KnowledgeGraphRuntimeResult {
    return this.runtime.execute(input);
  }

  reset(): void {
    this.runtime.reset();
  }
}