import { EnterpriseKnowledgeGraphRuntime } from "./enterpriseKnowledgeGraphRuntime";
import { EnterpriseKnowledgeGraphRuntimeContract } from "./knowledgeGraphRuntimeContracts";

export class KnowledgeGraphRuntimeFactory {
  create(): EnterpriseKnowledgeGraphRuntimeContract {
    return new EnterpriseKnowledgeGraphRuntime();
  }
}