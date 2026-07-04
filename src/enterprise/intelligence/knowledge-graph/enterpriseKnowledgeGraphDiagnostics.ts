import { EnterpriseKnowledgeGraphOrchestrator } from "./enterpriseKnowledgeGraphOrchestrator";
import {
  KnowledgeGraphSourceComposerInput,
} from "./knowledgeGraphSourceComposer";
import {
  KnowledgeGraphDiagnostics,
  getKnowledgeGraphDiagnostics,
} from "./knowledgeGraphDiagnostics";

export function getEnterpriseKnowledgeGraphDiagnostics(
  input: KnowledgeGraphSourceComposerInput,
): KnowledgeGraphDiagnostics {
  const orchestrator = new EnterpriseKnowledgeGraphOrchestrator();
  const graph = orchestrator.buildFromEnterpriseSources(input);

  return getKnowledgeGraphDiagnostics(graph);
}