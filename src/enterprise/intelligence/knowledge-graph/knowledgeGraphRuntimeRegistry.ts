import { KnowledgeGraphRuntimeBridge } from "./knowledgeGraphRuntimeBridge";

export class KnowledgeGraphRuntimeRegistry {
  private readonly bridge = new KnowledgeGraphRuntimeBridge();

  getRuntime(): KnowledgeGraphRuntimeBridge {
    return this.bridge;
  }

  reset(): void {
    this.bridge.reset();
  }
}