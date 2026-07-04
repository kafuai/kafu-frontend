import { KnowledgeGraphRuntimeManager } from "./knowledgeGraphRuntimeManager";

export type KnowledgeGraphRuntimeHealth = {
  healthy: boolean;
  status: string;
  checkedAt: string;
};

export class KnowledgeGraphRuntimeHealthChecker {
  constructor(
    private readonly manager = new KnowledgeGraphRuntimeManager(),
  ) {}

  check(): KnowledgeGraphRuntimeHealth {
    return {
      healthy: true,
      status: this.manager.getRuntime().getStatus(),
      checkedAt: new Date().toISOString(),
    };
  }
}