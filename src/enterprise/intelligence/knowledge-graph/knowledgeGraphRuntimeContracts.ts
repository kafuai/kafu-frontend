import {
  KnowledgeGraphRuntimeInput,
  KnowledgeGraphRuntimeResult,
  KnowledgeGraphRuntimeStatus,
} from "./knowledgeGraphRuntimeTypes";

export interface EnterpriseKnowledgeGraphRuntimeContract {
  getStatus(): KnowledgeGraphRuntimeStatus;

  execute(
    input: KnowledgeGraphRuntimeInput,
  ): KnowledgeGraphRuntimeResult;

  reset(): void;
}