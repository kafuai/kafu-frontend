import { EnterpriseKnowledgeGraphOrchestrator } from "./enterpriseKnowledgeGraphOrchestrator";
import {
  KnowledgeGraphRuntimeInput,
  KnowledgeGraphRuntimeResult,
  KnowledgeGraphRuntimeStatus,
} from "./knowledgeGraphRuntimeTypes";
import { getKnowledgeGraphDiagnostics } from "./knowledgeGraphDiagnostics";

export class KnowledgeGraphRuntime {
  private status: KnowledgeGraphRuntimeStatus = "idle";

  constructor(
    private readonly orchestrator = new EnterpriseKnowledgeGraphOrchestrator(),
  ) {}

  getStatus(): KnowledgeGraphRuntimeStatus {
    return this.status;
  }

  run(input: KnowledgeGraphRuntimeInput): KnowledgeGraphRuntimeResult {
    this.status = "building";

    try {
      const graph = this.orchestrator.buildFromEnterpriseSources(input);

      this.status = "ready";

      return {
        graph,
        diagnostics: getKnowledgeGraphDiagnostics(graph),
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.status = "failed";
      throw error;
    }
  }

  reset(): void {
    this.status = "idle";
  }
}