import {
  EnterpriseKnowledgeGraph,
} from "./enterpriseKnowledgeGraph";
import {
  KnowledgeGraphSourceComposer,
  KnowledgeGraphSourceComposerInput,
} from "./knowledgeGraphSourceComposer";
import {
  CorporateKnowledgeGraph,
} from "./knowledgeGraphTypes";

export class EnterpriseKnowledgeGraphOrchestrator {
  constructor(
    private readonly composer = new KnowledgeGraphSourceComposer(),
    private readonly knowledgeGraph = new EnterpriseKnowledgeGraph(),
  ) {}

  buildFromEnterpriseSources(
    input: KnowledgeGraphSourceComposerInput,
  ): CorporateKnowledgeGraph {
    const sources = this.composer.compose(input);
    return this.knowledgeGraph.build(sources);
  }
}