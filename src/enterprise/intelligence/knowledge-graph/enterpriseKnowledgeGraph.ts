import { KnowledgeGraphIntelligenceEngine } from "./knowledgeGraphIntelligenceEngine";
import {
  KnowledgeExtractionSource,
} from "./knowledgeExtractionTypes";
import { CorporateKnowledgeGraph } from "./knowledgeGraphTypes";
import {
  KnowledgeGraphDiagnostics,
  getKnowledgeGraphDiagnostics,
} from "./knowledgeGraphDiagnostics";

export class EnterpriseKnowledgeGraph {
  constructor(
    private readonly intelligenceEngine =
      new KnowledgeGraphIntelligenceEngine(),
  ) {}

  build(
    sources: KnowledgeExtractionSource[],
  ): CorporateKnowledgeGraph {
    return this.intelligenceEngine.buildEnterpriseKnowledgeGraph(sources);
  }

  diagnostics(
    graph: CorporateKnowledgeGraph,
  ): KnowledgeGraphDiagnostics {
    return getKnowledgeGraphDiagnostics(graph);
  }
}